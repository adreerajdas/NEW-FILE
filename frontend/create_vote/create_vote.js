document.addEventListener("DOMContentLoaded", () => {
  const addOptionBtn = document.getElementById("addOptionBtn");
  const optionsContainer = document.getElementById("optionsContainer");
  const voteForm = document.getElementById("voteForm");
  const shareSection = document.getElementById("shareSection");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const voteLinkInput = document.getElementById("voteLink");
  const shareBtns = document.querySelectorAll(".share-btn");

  shareSection.style.display = "none";

  addOptionBtn.addEventListener("click", () => {
    const optionCount = optionsContainer.children.length + 1;
    if (optionCount > 10) {
      alert("Maximum 10 options allowed.");
      return;
    }

    const optionWrapper = document.createElement("div");
    optionWrapper.className = "option-wrapper";

    const newOption = document.createElement("input");
    newOption.type = "text";
    newOption.className = "option-input";
    newOption.placeholder = `Option ${optionCount}`;
    newOption.required = true;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-option";
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener("click", () => {
      if (optionsContainer.children.length > 2) {
        optionsContainer.removeChild(optionWrapper);
      } else {
        alert("At least two options are required.");
      }
    });

    optionWrapper.appendChild(newOption);
    optionWrapper.appendChild(removeBtn);
    optionsContainer.appendChild(optionWrapper);
  });

  voteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const deadline = document.getElementById("deadline").value;
    const visibility = document.getElementById("visibility").value;
    const options = Array.from(
      document.querySelectorAll(".option-input")
    ).map(input => input.value.trim()).filter(v => v !== "");

    if (!title) return alert("Please enter a vote title.");
    if (!deadline) return alert("Please select a deadline.");
    if (options.length < 2) return alert("Please enter at least two options.");

    const voteData = {
      title,
      description,
      expiry: deadline,
      type: visibility,
      options
    };

    try {
      const response = await fetch("http://localhost:5000/api/create_vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(voteData)
      });

      const data = await response.json();

      if (response.ok && data.vote_id) {
        const voteLink = generateVoteLink(data.vote_id);
        voteLinkInput.value = voteLink;
        shareSection.style.display = "block";
        shareSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert(data.error || "Failed to create vote.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend.");
    }
  });

  copyLinkBtn.addEventListener("click", () => {
    voteLinkInput.select();
    document.execCommand("copy");

    const originalText = copyLinkBtn.innerHTML;
    copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      copyLinkBtn.innerHTML = originalText;
    }, 2000);
  });

  shareBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const platform = btn.dataset.platform;
      const title = document.getElementById("title").value;
      const link = voteLinkInput.value;

      const message = `Check out this vote: "${title}"\n\nVote here: ${link}`;
      let shareUrl = "";

      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`;
          break;
      }

      if (platform === "email") {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    });
  });

  function generateVoteLink(voteId) {
    return `${window.location.origin}/frontend/vote_page/vote_page.html?vote_id=${voteId}`;
  }
});
