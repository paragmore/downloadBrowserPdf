var script1 = document.createElement('script');
script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
script1.onload = function() {
    console.log('html2canvas library loaded');
};
document.head.appendChild(script1);

var script2 = document.createElement('script');
script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
script2.onload = function() {
    console.log('jsPDF library loaded');
};
document.head.appendChild(script2);
(async function() {
    // Wait until jsPDF and html2canvas are loaded
    while (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Get the content of the div
    const div = document.getElementById('viewerContainer');
    if (div) {
        const { jsPDF } = window.jspdf;

        // Use html2canvas to capture the entire content of the div
        const canvas = await html2canvas(div, {
            width: div.scrollWidth,
            height: div.scrollHeight,
            windowWidth: div.scrollWidth,
            windowHeight: div.scrollHeight,
            scale: 1
        });

        // Create a new PDF document
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add new pages if necessary
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save('divContent.pdf');
        console.log('PDF saved');
    } else {
        console.log('Div not found');
    }
})();
