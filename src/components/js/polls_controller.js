(function(){document.getElementById('item-description').addEventListener('input', e=>{
    let span = document.querySelectorAll('form span')
    let submit = document.getElementById('submit-btn')
    
    if(e.target.value.length > 99){
        if(span.length>0){
            for(let i =0;i<span.length;i++){
                e.target.parentElement.removeChild(span[i])
            }
        }
        let errorHTML = 'Description must be 100 characters or less'
        let el = document.createElement('span')
        console.log(el.style)
        el.setAttribute('style', "color: red")
        el.innerHTML = errorHTML
        e.target.parentElement.appendChild(el)
        submit.disabled=true
        
    }else{
        if(span.length>0){
            e.target.parentElement.removeChild(span[0])
        }
        if(submit.disabled){
            submit.disabled = false;
        }
    }
}) })();