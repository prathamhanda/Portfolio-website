import fetch from "node-fetch";

const USERNAME = "prathamhanda";
const URL = "https://leetcode.com/graphql";

const query = `
query fullUserData($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}
`;

async function analyzeCounts() {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0"
    },
    body: JSON.stringify({
      query,
      variables: { username: USERNAME }
    })
  });

  const data = await response.json();
  const submitStats = data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];

  let easy = 0, medium = 0, hard = 0, total = 0;
  submitStats.forEach(stat => {
    const difficulty = stat.difficulty?.toLowerCase();
    const count = parseInt(stat.count) || 0;
    total += count;
    if (difficulty === "easy") easy = count;
    else if (difficulty === "medium") medium = count;
    else if (difficulty === "hard") hard = count;
  });

  console.log("=== BREAKDOWN OF YOUR DASHBOARD COUNT ===\n");
  
  console.log("📊 FROM LEETCODE API:");
  console.log("   Easy:", easy);
  console.log("   Medium:", medium);  
  console.log("   Hard:", hard);
  console.log("   LeetCode Total:", total);
  console.log("");
  
  console.log("🔢 ADDITIONAL COUNTS:");
  console.log("   GFG count (hardcoded):", 304);
  console.log("   Extra hardcoded value:", 550);
  console.log("");
  
  console.log("🧮 FINAL CALCULATION:");
  console.log("   LeetCode:", total);
  console.log("   + GFG:", 304);  
  console.log("   + Hardcoded:", 550);
  console.log("   = TOTAL DISPLAYED:", total + 304 + 550);
  console.log("");
  
  console.log("📋 PROBLEM BREAKDOWN CALCULATION:");
  console.log("(LeetCode + proportional GFG distribution + hardcoded values)");
  
  // Calculate GFG distribution (same logic as in dashboard)
  const gfgCount = 304;
  const totalLeetBreakdown = easy + medium + hard;
  let addEasy = 0, addMed = 0, addHard = 0;
  
  if (gfgCount > 0 && totalLeetBreakdown > 0) {
    const pEasy = easy / totalLeetBreakdown;
    const pMed = medium / totalLeetBreakdown;
    const pHard = hard / totalLeetBreakdown;
    addEasy = Math.floor(pEasy * gfgCount);
    addMed = Math.floor(pMed * gfgCount);
    addHard = Math.floor(pHard * gfgCount);
    
    // Handle remainder
    let rem = gfgCount - (addEasy + addMed + addHard);
    const order = [
      { key: 'easy', prop: pEasy },
      { key: 'med', prop: pMed },
      { key: 'hard', prop: pHard }
    ].sort((a, b) => b.prop - a.prop);
    let idx = 0;
    while (rem > 0) {
      const k = order[idx % 3].key;
      if (k === 'easy') addEasy++;
      else if (k === 'med') addMed++;
      else addHard++;
      rem--;
      idx++;
    }
  }
  
  console.log("   Easy:", easy, "+ (GFG)", addEasy, "+ 257 =", easy + addEasy + 257);
  console.log("   Medium:", medium, "+ (GFG)", addMed, "+ 257 =", medium + addMed + 257);  
  console.log("   Hard:", hard, "+ (GFG)", addHard, "+ 36 =", hard + addHard + 36);
  console.log("");
  
  console.log("✅ Your dashboard shows:", total + 304 + 550, "total questions");
  console.log("   LeetCode API contributes:", total, "questions (" + ((total / (total + 304 + 550)) * 100).toFixed(1) + "%)");
  console.log("   GFG contributes:", 304, "questions (" + ((304 / (total + 304 + 550)) * 100).toFixed(1) + "%)");
  console.log("   Hardcoded extra contributes:", 550, "questions (" + ((550 / (total + 304 + 550)) * 100).toFixed(1) + "%)");
}

analyzeCounts();