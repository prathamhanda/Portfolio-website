from __future__ import annotations

import argparse
import os
import stat
from pathlib import Path
from typing import Callable, Iterable

from PIL import Image, ImageOps


DEFAULT_MAX_SIZE = 500 * 1024  # 500KB


def format_kb(num_bytes: int) -> str:
    return f"{num_bytes / 1024:.0f}KB"


def _tmp_path_for(path: Path) -> Path:
    return path.with_suffix(path.suffix + ".tmp")


def _best_path_for(path: Path) -> Path:
    return path.with_suffix(path.suffix + ".besttmp")


def _try_save_candidate(path: Path, save_fn: Callable[[Path], None]) -> int:
    tmp = _tmp_path_for(path)
    if tmp.exists():
        tmp.unlink()
    save_fn(tmp)
    return tmp.stat().st_size


def _set_best(path: Path) -> None:
    tmp = _tmp_path_for(path)
    best = _best_path_for(path)
    if best.exists():
        best.unlink()
    tmp.replace(best)


def _make_writable(path: Path) -> None:
    try:
        os.chmod(path, stat.S_IWRITE | stat.S_IREAD)
    except Exception:  # noqa: BLE001
        return


def _finalize_if_better(path: Path, before: int, best_size: int, max_size: int) -> bool:
    best = _best_path_for(path)

    # Only replace if it actually improves size, or it hits the target when the original was oversize.
    if best.exists() and (best_size < before or (before > max_size and best_size <= max_size)):
        try:
            best.replace(path)
        except PermissionError:
            # Windows can throw AccessDenied if the target is read-only.
            _make_writable(path)
            best.replace(path)
        return True

    best.unlink(missing_ok=True)
    return False


def compress_jpeg(path: Path, max_size: int) -> tuple[bool, str, int]:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    before = path.stat().st_size
    best_size = before
    best_note = "jpeg (no change)"

    for quality in range(95, 14, -5):
        size = _try_save_candidate(
            path,
            lambda out: img.save(
                out,
                format="JPEG",
                optimize=True,
                progressive=True,
                quality=quality,
            ),
        )
        if size < best_size:
            best_size = size
            best_note = f"jpeg q={quality}"
            _set_best(path)
        if size <= max_size:
            best_size = size
            best_note = f"jpeg q={quality}"
            if _tmp_path_for(path).exists():
                _set_best(path)
            break

    ok = best_size <= max_size
    replaced = _finalize_if_better(path, before, best_size, max_size)
    _tmp_path_for(path).unlink(missing_ok=True)
    return ok, best_note, before if not replaced else best_size


def compress_webp(path: Path, max_size: int) -> tuple[bool, str, int]:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)

    before = path.stat().st_size
    best_size = before
    best_note = "webp (no change)"

    for quality in range(90, 9, -5):
        size = _try_save_candidate(
            path,
            lambda out: img.save(
                out,
                format="WEBP",
                method=6,
                quality=quality,
            ),
        )
        if size < best_size:
            best_size = size
            best_note = f"webp q={quality}"
            _set_best(path)
        if size <= max_size:
            best_size = size
            best_note = f"webp q={quality}"
            if _tmp_path_for(path).exists():
                _set_best(path)
            break

    ok = best_size <= max_size
    replaced = _finalize_if_better(path, before, best_size, max_size)
    _tmp_path_for(path).unlink(missing_ok=True)
    return ok, best_note, before if not replaced else best_size


def compress_png(path: Path, max_size: int, *, allow_resize: bool = False) -> tuple[bool, str, int]:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)

    before = path.stat().st_size
    best_size = before
    best_note = "png (no change)"

    def save_optimized(out: Path) -> None:
        img.save(out, format="PNG", optimize=True, compress_level=9)

    size = _try_save_candidate(path, save_optimized)
    if size < best_size:
        best_size = size
        best_note = "png optimize"
        _set_best(path)

    if size > max_size:
        has_alpha = "A" in img.getbands()
        for colors in (256, 192, 128, 96, 64, 48, 32, 24, 16):
            if has_alpha:
                # Try alpha-capable quantization. This can reduce large RGBA PNGs a lot.
                quantized = img.convert("RGBA").quantize(
                    colors=colors,
                    method=Image.Quantize.FASTOCTREE,
                    dither=Image.Dither.NONE,
                )
            else:
                quantized = img.convert("RGB").convert(
                    "P", palette=Image.Palette.ADAPTIVE, colors=colors
                )

            size = _try_save_candidate(
                path,
                lambda out, q=quantized: q.save(out, format="PNG", optimize=True, compress_level=9),
            )
            if size < best_size:
                best_size = size
                best_note = f"png quantize colors={colors}{' (alpha)' if has_alpha else ''}"
                _set_best(path)
            if size <= max_size:
                best_size = size
                best_note = f"png quantize colors={colors}{' (alpha)' if has_alpha else ''}"
                if _tmp_path_for(path).exists():
                    _set_best(path)
                break

        # If we're still oversize, optionally reduce dimensions.
        if allow_resize and best_size > max_size:
            base_img = img.convert("RGBA") if has_alpha else img.convert("RGB")
            w0, h0 = base_img.size

            def try_with(image: Image.Image, label: str) -> None:
                nonlocal best_size, best_note
                s = _try_save_candidate(
                    path,
                    lambda out, im=image: im.save(
                        out, format="PNG", optimize=True, compress_level=9
                    ),
                )
                if s < best_size:
                    best_size = s
                    best_note = label
                    _set_best(path)

            for scale in (0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5):
                w = max(1, int(w0 * scale))
                h = max(1, int(h0 * scale))
                resized = base_img.resize((w, h), resample=Image.Resampling.LANCZOS)

                try_with(resized, f"png resize {w}x{h}"
                         f"{' (alpha)' if has_alpha else ''}")
                if best_size <= max_size:
                    break

                # After resizing, try a small quantization sweep again.
                for colors in (256, 192, 128, 96, 64, 48, 32, 24, 16):
                    if has_alpha:
                        q = resized.quantize(
                            colors=colors,
                            method=Image.Quantize.FASTOCTREE,
                            dither=Image.Dither.NONE,
                        )
                        label = f"png resize {w}x{h} quantize colors={colors} (alpha)"
                    else:
                        q = resized.convert("RGB").convert(
                            "P", palette=Image.Palette.ADAPTIVE, colors=colors
                        )
                        label = f"png resize {w}x{h} quantize colors={colors}"
                    try_with(q, label)
                    if best_size <= max_size:
                        break
                if best_size <= max_size:
                    break

    ok = best_size <= max_size
    replaced = _finalize_if_better(path, before, best_size, max_size)
    _tmp_path_for(path).unlink(missing_ok=True)
    return ok, best_note, before if not replaced else best_size


def compress_image(path: Path, max_size: int, *, allow_resize: bool = False) -> tuple[bool, str, int, int]:
    before = path.stat().st_size
    ext = path.suffix.lower()

    if ext in (".jpg", ".jpeg"):
        ok, note, _ = compress_jpeg(path, max_size)
    elif ext == ".webp":
        ok, note, _ = compress_webp(path, max_size)
    elif ext == ".png":
        ok, note, _ = compress_png(path, max_size, allow_resize=allow_resize)
    else:
        return False, "unsupported", before, before

    after = path.stat().st_size
    return ok, note, before, after


def _iter_images(roots: Iterable[Path]) -> list[Path]:
    exts = {".jpg", ".jpeg", ".png", ".webp"}
    ignored_dirs = {
        ".git",
        "node_modules",
        "dist",
        "build",
        ".vercel",
        ".next",
        "coverage",
    }

    files: list[Path] = []
    for root in roots:
        if not root.exists():
            continue
        if root.is_file() and root.suffix.lower() in exts:
            files.append(root)
            continue
        if not root.is_dir():
            continue

        for path in root.rglob("*"):
            # Skip whole directory subtrees.
            if any(part in ignored_dirs for part in path.parts):
                continue
            if path.is_file() and path.suffix.lower() in exts:
                files.append(path)

    return sorted(set(files))


def main() -> int:
    parser = argparse.ArgumentParser(description="Compress images in-place without resizing.")
    parser.add_argument(
        "paths",
        nargs="*",
        default=["public", "src"],
        help="Root folders/files to scan recursively (default: public src)",
    )
    parser.add_argument(
        "--max-kb",
        type=int,
        default=500,
        help="Max file size in KB (default: 500)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Also process files already under the size limit (default: skip).",
    )
    parser.add_argument(
        "--allow-resize",
        action="store_true",
        help="If still oversize, try reducing dimensions (PNG only).",
    )
    args = parser.parse_args()

    roots = [Path(p) for p in args.paths]
    max_size = args.max_kb * 1024

    files = _iter_images(roots)
    if not files:
        raise SystemExit(f"No supported images found under: {', '.join(map(str, roots))}")

    changed = 0
    warned = 0
    skipped = 0
    errors = 0

    for path in files:
        try:
            before = path.stat().st_size
            if not args.all and before <= max_size:
                skipped += 1
                continue

            ok, note, before, after = compress_image(path, max_size, allow_resize=args.allow_resize)
            if after != before:
                changed += 1

            status = "OK" if ok else "WARN"
            if not ok:
                warned += 1

            print(f"{status} {path.as_posix()}: {format_kb(before)} -> {format_kb(after)} ({note})")
        except Exception as exc:  # noqa: BLE001
            errors += 1
            print(f"ERROR {path.as_posix()}: {exc}")

    print(
        "Done. "
        f"Found={len(files)} Skipped={skipped} Changed={changed} Warn={warned} Errors={errors} "
        f"Max={args.max_kb}KB"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
