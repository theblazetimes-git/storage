const correctPassword = "secure123"; // Set your password here

        function getFileNameFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const encodedFileName = urlParams.get('file');
            if (encodedFileName) {
                try {
                    const decodedFileName = atob(encodedFileName); // Decode the base64 file name
                    return decodedFileName;
                } catch (e) {
                    console.error("Error decoding file name:", e);
                    return null;
                }
            }
            return null;
        }

        function fetchFileData(fileName) {
            // Example: Fetch the file from the server or use a predefined file
            // Here we're using a simple fetch to simulate retrieving the file as a Blob
            // You can modify this to fetch from your server
            return fetch(`/zip/${fileName}`)  // Replace with your actual server path
                .then(response => response.blob())
                .catch(err => console.error("Error fetching file:", err));
        }

        function revealDownloadLink() {
            const passwordInput = document.getElementById('passwordInput').value;
            const statusMessage = document.getElementById('statusMessage');
            if (passwordInput === correctPassword) {
                const fileName = getFileNameFromUrl();
                if (fileName) {
                    statusMessage.textContent = `Password accepted. Preparing download for ${fileName}...`;
                    statusMessage.style.color = "#00ff00";

                    fetchFileData(fileName).then(blob => {
                        // Create a Blob URL for the file
                        const url = URL.createObjectURL(blob);

                        // Create a hidden link and trigger the download
                        const hiddenLink = document.createElement('a');
                        hiddenLink.href = url;
                        hiddenLink.download = fileName;
                        hiddenLink.style.display = 'none';
                        document.body.appendChild(hiddenLink);

                        // Trigger the download
                        hiddenLink.click();
                        document.body.removeChild(hiddenLink);

                        // Revoke the object URL after download
                        URL.revokeObjectURL(url);
                    }).catch(err => {
                        statusMessage.textContent = "Error fetching the file. Please try again later.";
                        statusMessage.style.color = "red";
                    });
                } else {
                    statusMessage.textContent = "Invalid file name parameter. Please check the URL.";
                    statusMessage.style.color = "red";
                }
            } else {
                statusMessage.textContent = "Incorrect password. Please try again.";
                statusMessage.style.color = "red";
            }
        }

        document.getElementById('passwordInput').addEventListener('input', function () {
            const passwordInput = this.value;
            const downloadButton = document.getElementById('downloadButton');
            if (passwordInput === correctPassword) {
                downloadButton.disabled = false;
                downloadButton.classList.add('enabled');
            } else {
                downloadButton.disabled = true;
                downloadButton.classList.remove('enabled');
            }
        });