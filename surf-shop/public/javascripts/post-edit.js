let postEditForm = document.getElementById("postEditForm");
 //add submit listener to form
 postEditForm.addEventListener("submit",function(event){
        //find no of uploaded images
        let imageUploads = document.getElementById("imageUpload").files.length;
        //find no of existing images
        let existingImgs = document.querySelectorAll(".imageDeleteCheckbox").length;
        //find no of potential deletions
        let imageDeletions = document.querySelectorAll(".imageDeleteCheckbox:checked").length;

        //check if images are full
        newTotal = existingImgs-imageDeletions+imageUploads;
        if(newTotal >4 ){
            event.preventDefault();
            let removeAmt = newTotal - 4;   
            alert(`You need to remove atleast ${removeAmt} (more) image${removeAmt ===1?'':'s'}`);
        }
 });