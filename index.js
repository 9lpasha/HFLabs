customElements.define('hf-labs', class extends HTMLElement{
    connectedCallback(){
        let shadow = this.attachShadow({mode: 'open'})
        shadow.innerHTML = `
        `
    }
})