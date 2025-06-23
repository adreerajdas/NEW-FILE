document.getElementById("exploreForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const voteId = document.getElementById("voteId").value.trim();

  if (!voteId) {
    alert("Please enter a valid vote ID.");
    return;
  }

  // Later: Verify ID with backend
  console.log("Exploring vote with ID:", voteId);
  alert(`Opening Vote ID: ${voteId} (Feature coming soon)`);

  // Redirect logic (in real case)
  // window.location.href = `../vote_page/vote.html?id=${voteId}`;
});
