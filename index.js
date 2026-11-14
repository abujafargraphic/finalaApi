const postForm = document.querySelector('.formPost')
const titlePost = document.querySelector('.title')
const contentContainer = document.querySelector('.content')
const cancelEdit = document.querySelector('.cancel-edit')
const errorMessage = document.querySelector('.error-message')

const bodyPost = document.querySelector('.body')
let editpostId = null;
let editposHTML = null;

function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = "";
}
  
async function createnewPost(){
   try{ 
    const response = await fetch("https://dummyjson.com/posts")
    if(!response.ok){
        throw new Error("there is an error")
    }
    const data = await response.json()
    const content = data.posts.map(item => {
        return `<article class="post"> 
                <h2>${item.title}</h2>
                <p>${item.body}</p>
                <button class="delete-btn" data-id="${item.id}">delete</button>
                <button class="edit-btn" data-id="${item.id}">edit</button>
                
                </article>
        `
    }).join("")
    contentContainer.innerHTML = content;
    console.log(contentContainer)
} catch(error){
    showError("Unable to load posts. Please try again.");
    console.log(error);
}
}
createnewPost();



postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearError()

    // OUTER IF: Are we editing an existing post?
    if (editpostId !== null) {

        // INNER IF: Is this a locally created post?
        if (editposHTML.querySelector(".edit-btn").dataset.local === "true") {

            // A: Update local post directly in the browser
            editposHTML.querySelector("h2").textContent = titlePost.value;
            editposHTML.querySelector("p").textContent = bodyPost.value;

        } else {

            // B: Update an API post
            const title = titlePost.value;
            const body = bodyPost.value;

            const editPost = {
                title,
                body,
                userId: 1
            };

            try {
                const response = await fetch(`https://dummyjson.com/posts/${editpostId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(editPost)
                });

                if (!response.ok) {
                    throw new Error("Something went wrong");
                }

                const data = await response.json();

                editposHTML.querySelector("h2").textContent = data.title;
                editposHTML.querySelector("p").textContent = data.body;

            } catch (error) {
    showError("Unable to edit posts. Please try again.");

                console.log(error);
                return;
            }
        }

        // Reset editing state after either kind of edit
        editpostId = null;
        editposHTML = null;
        postForm.reset();
        cancelEdit.style.display = "none";

    } else {

        // C: Create a completely new post
        const title = titlePost.value;
        const body = bodyPost.value;

        const newPost = {
            title,
            body,
            userId: 1
        };

        try {
            const response = await fetch("https://dummyjson.com/posts/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPost)
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            const data = await response.json();

            contentContainer.insertAdjacentHTML("afterbegin", `
                <article class="post">
                    <h2>${data.title}</h2>
                    <p>${data.body}</p>
                    <button class="delete-btn" data-id="${data.id}" data-local="true">delete</button>
                    <button class="edit-btn" data-id="${data.id}" data-local="true">edit</button>
                </article>
            `);

            postForm.reset();

            console.log(data);

        } catch (error) {
    showError("Unable to create posts. Please try again.");

            console.log(error);
        }
    }
});




async function deletePost(btn){
    clearError();
  
    const postElement = btn.closest(".post");
    


   if(btn.dataset.local === "true"){

      if (postElement === editposHTML) {
   editpostId = null;
editposHTML = null;
postForm.reset();
cancelEdit.style.display = "none";
}

   return postElement.remove();
   }
  const itemId = btn.dataset.id
   try{ 
    const response = await fetch(`https://dummyjson.com/posts/${itemId}`, {
        method: "DELETE" ,  
    } );
    if(!response.ok){
        throw new Error("something went to wrong")
    }
    const data = await response.json()
     
     
      if (postElement === editposHTML) {
        editpostId = null;
        editposHTML = null;
        postForm.reset();
        cancelEdit.style.display = "none";
}

     postElement.remove();
    console.log(data)
} catch(error){
    showError("Unable to delete posts. Please try again.");

    console.log(error)
}

}  

  
  
contentContainer.addEventListener('click', (event) => {
 const btn = event.target.closest(".delete-btn")
 if(btn) {
    deletePost(btn)
    return;
 };
 const edit = event.target.closest(".edit-btn")
 if(edit){
    cancelEdit.style.display = "block"
    editpostId = edit.dataset.id;
    editposHTML = edit.closest(".post")
 const title = editposHTML.querySelector("h2").textContent;
 const body = editposHTML.querySelector("p").textContent;
  
 titlePost.value = title;
 bodyPost.value = body;




 }
  

   

 
})

 cancelEdit.addEventListener('click', () => {
        editpostId = null;
        editposHTML = null;
        postForm.reset();
        cancelEdit.style.display = "none";
 })


/* postForm.addEventListener('submit' , async (event) => {

    event.preventDefault();
if(editpostId !== null){

    if(editposHTML.querySelector(".edit-btn").dataset.local === "true"){
         // A: Update local post directly in the browser
            editposHTML.querySelector("h2").textContent = titlePost.value;
            editposHTML.querySelector("p").textContent = bodyPost.value;

    } else{
          // B: Update an API post
            const title = titlePost.value;
            const body = bodyPost.value;

            const editPost = {
                title,
                body,
                userId: 1
            };
    const response = await fetch(`https://dummyjson.com/posts/${editpostId}`,{
        method: "PUT",
        headers: { "content-Type": "application/json"},
        body: JSON.stringify(editPost)
    })
    if(!response.ok){
        throw new Error("something went to wrong")
    }
    const data = await response.json();
      editposHTML.querySelector("h2").textContent = data.title;
      editposHTML.querySelector("p").textContent = data.body;
}

const title = titlePost.value 
const body = bodyPost.value 
    const newPost = {
        title,
        body,
        userId: 1
    }
} else{ 
      
try{ 
    const response = await fetch("https://dummyjson.com/posts/add",{
        method:"POST",
        headers:{
            "content-Type": "application/json"
        }, body: JSON.stringify(newPost)
    })
     if (!response.ok) {
    throw new Error("Failed to create post");
}
    const data = await response.json();
    contentContainer.insertAdjacentHTML("afterbegin",
        ` 
               <article class="post"> 
                <h2>${data.title}</h2>
                <p>${data.body}</p>
                <button class="delete-btn" data-id="${data.id}" data-local="true">delete</button>
                <button class="edit-btn" data-id="${data.id}" data-local="true">edit</button>

                </article>`

    )
               
    
    console.log(data)
}  catch(error){
    console.log(error)
}}
}
)*/