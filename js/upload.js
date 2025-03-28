// File Upload Functionality

const uploadBox = document.getElementById('upload-box');
const fileInput = document.getElementById('file-input');
const fileList = document.querySelector('.file-list');
const proceedContainer = document.querySelector('.proceed-container');
const proceedButton = document.getElementById('proceed-to-pay');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    uploadBox.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    uploadBox.classList.add('dragover');
}

function unhighlight(e) {
    uploadBox.classList.remove('dragover');
}

// Handle dropped files
uploadBox.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle file input selection
fileInput.addEventListener('change', function(e) {
    handleFiles(this.files);
});

// Store uploaded files
let uploadedFiles = [];

// Create modal for PDF preview
const previewModal = document.createElement('div');
previewModal.className = 'pdf-preview-modal';
previewModal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <iframe id="pdf-viewer"></iframe>
    </div>
`;
document.body.appendChild(previewModal);

// Close modal when clicking the close button or outside the modal
const closeBtn = previewModal.querySelector('.close-modal');
closeBtn.onclick = () => previewModal.style.display = 'none';
window.onclick = (event) => {
    if (event.target === previewModal) {
        previewModal.style.display = 'none';
    }
};

// Initialize Proceed to Pay button
proceedButton.addEventListener('click', function() {
    alert('Processing payment for ' + uploadedFiles.length + ' file(s)...');
    // Here you would normally redirect to a payment page or process payment
});

function handleFiles(files) {
    // Convert FileList to Array for easier processing
    Array.from(files).forEach(file => {
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            alert(`File ${file.name} is not a PDF file`);
            return;
        }
        
        // Validate file size (100MB)
        if (file.size > 100 * 1024 * 1024) {
            alert(`File ${file.name} exceeds 100MB limit`);
            return;
        }

        // Add file to the list if not already present
        if (!uploadedFiles.some(f => f.name === file.name)) {
            uploadedFiles.push(file);
        }
    });
    
    updateFileList();
    updateProceedButton();
}

function updateFileList() {
    // Clear existing list
    fileList.innerHTML = '';

    // If no files, hide the container
    if (uploadedFiles.length === 0) {
        fileList.style.display = 'none';
        return;
    } else {
        fileList.style.display = 'block';
    }

    uploadedFiles.forEach((file, index) => {
        // Create file item element
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Create file name element
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        fileName.onclick = () => previewFile(file);
        
        // Create success icon
        const successIcon = document.createElement('div');
        successIcon.className = 'success-icon';
        successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fas fa-times-circle"></i>';
        deleteButton.onclick = () => {
            uploadedFiles.splice(index, 1);
            updateFileList();
            updateProceedButton();
        };
        
        // Append elements to file item
        fileItem.appendChild(successIcon);
        fileItem.appendChild(fileName);
        fileItem.appendChild(deleteButton);
        
        // Append file item to file list
        fileList.appendChild(fileItem);
    });
}

function updateProceedButton() {
    if (uploadedFiles.length > 0) {
        proceedContainer.style.display = 'block';
    } else {
        proceedContainer.style.display = 'none';
    }
}

function previewFile(file) {
    const fileURL = URL.createObjectURL(file);
    const pdfViewer = document.getElementById('pdf-viewer');
    pdfViewer.src = fileURL;
    previewModal.style.display = 'block';
    
    // Clean up the object URL when the modal is closed
    const cleanup = () => {
        previewModal.style.display = 'none';
        URL.revokeObjectURL(fileURL);
    };

    closeBtn.onclick = cleanup;
    previewModal.onclick = (event) => {
        if (event.target === previewModal) {
            cleanup();
        }
    };
}