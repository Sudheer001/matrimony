  
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";


  export const handleDownloadPDF_util = async (profileRef, profile) => {
    const input = profileRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true, // allow cross-origin images
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // If content exceeds one page, add extra pages
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${profile.name}_profile.pdf`);
  };

export const HandleProfileDeletion_util = (id) => {
    const navigate = useNavigate();
    if (window.confirm("Delete this profile?")) {
      fetch(`${process.env.REACT_APP_API_URL}delete_profile/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
         navigate(process.env.PUBLIC_URL+'/');
        });
    }
  };



