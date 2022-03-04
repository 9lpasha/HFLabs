customElements.define('hf-labs', class extends HTMLElement {
    connectedCallback() {
        let shadow = this.attachShadow({mode: 'open'})
        shadow.innerHTML = `
<style>
    p {
        margin: 0;
    }
    .single_p{
        padding-top: 16px;
        display: none;
    }

    body {
        padding: 10px;
    }

    p, input {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .double_p {
        margin-top: 16px;
        margin-bottom: 0;
    }

    .bold_p {
        margin-bottom: 16px;
    }

    input {
        padding: 4px;
        width: 50%;
    }

    div {
        position: relative;
    }

    div input {
        width: calc(100% - 10px);
    }

    .hints {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translate(0, 100%);
        background: white;
        border-radius: 2px;
        outline: 1px solid black;
        width: calc(100% - 10px);
    }

    .hints div {
        width: calc(100% - 8px);
        padding: 4px 4px;
        margin: auto 0;
        display: none;
        cursor: pointer;
    }

    .hint:hover {
        background: #cecece;
    }

    .hint span {
        color: #5e5e5e;
        margin-right: 5px;
    }

    @media (max-width: 768px) {
        input{
            width: calc(100% - 10px);
        }
    }
</style>

<div>
    <p class="bold_p">Компания или ИП</p>
    <input placeholder="Введите название организации" type="text">
    <div class="hints">
        <div class="hint">
            <p></p>
            <span></span>
            <span></span>
        </div>
        <div class="hint">
            <p></p>
            <span></span>
            <span></span>
        </div>
        <div class="hint">
            <p></p>
            <span></span>
            <span></span>
        </div>
        <div class="hint">
            <p></p>
            <span></span>
            <span></span>
        </div>
        <div class="hint">
            <p></p>
            <span></span>
            <span></span>
        </div>
    </div>
</div>
<p class="single_p"></p>
<p class="double_p">Краткое наименование</p>
<input type="text">
<p class="double_p">Полное наименование</p>
<input type="text">
<p class="double_p">ИНН / КПП</p>
<input type="text">
<p class="double_p">Адрес</p>
<input type="text">`

        let requestToDadata = (query) => {
            let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
            let token = "d3b7dcaa940bae1bb9df9b1e78fe1c45acc9b1b9";

            let options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({query: query})
            }

            return fetch(url, options)
                .then(response => response.text())
                .then(result => {
                    responseMas = JSON.parse(result);
                    console.log(responseMas)
                })
        }

        let responseMas
        let selectResponse
        let input = this.shadowRoot.querySelector('input')

        let hintsFunc = () => {
            requestToDadata(input.value)
                .then(() => {
                    if (input.value != '') {
                        let hints = this.shadowRoot.querySelector('.hints')
                        for (let i = 0; i < 5; i++) {
                            hints.children[i].style.display = 'none'
                        }
                        hints.style.display = 'block'
                        let hint = this.shadowRoot.querySelectorAll('.hint')
                        for (let i = 0; i < responseMas.suggestions.length && i < 5; i++) {
                            hint[i].children[0].textContent = responseMas.suggestions[i].value
                            hint[i].children[1].textContent = responseMas.suggestions[i].data.inn
                            hint[i].children[2].textContent = responseMas.suggestions[i].data.address.unrestricted_value
                            hint[i].style.display = 'block'
                        }
                    } else {
                        this.shadowRoot.querySelector('.hints').style.display = 'none'
                    }
                    document.onclick = (e) => {
                        const withinBoundaries = e.composedPath().includes(this.shadowRoot.querySelector('.hints'));

                        if (!withinBoundaries) {
                            this.shadowRoot.querySelector('.hints').style.display = 'none';
                        }
                    }
                    let hints = this.shadowRoot.querySelectorAll('.hint')
                    hints.forEach((el) => el.onclick = () => {
                            for (let i = 0; i < responseMas.suggestions.length && i < 5; i++) {
                                if (el.children[1].textContent == responseMas.suggestions[i].data.inn)
                                    selectResponse = i
                            }
                            let inputs = this.shadowRoot.querySelectorAll('input')
                            inputs[1].value = responseMas.suggestions[selectResponse].data.name.short_with_opf
                            inputs[2].value = responseMas.suggestions[selectResponse].data.name.full_with_opf
                            inputs[3].value = responseMas.suggestions[selectResponse].data.inn + ' / ' + responseMas.suggestions[selectResponse].data.kpf
                            inputs[4].value = responseMas.suggestions[selectResponse].data.address.unrestricted_value
                        this.shadowRoot.querySelector('.hints').style.display = 'none'
                        this.shadowRoot.querySelector('.single_p').style.display = 'block'
                        this.shadowRoot.querySelector('.single_p').textContent = 'Организация (' + responseMas.suggestions[selectResponse].data.type + ')'
                        }
                    )
                })
        }
        input.oninput = () => {
            hintsFunc()
        }
        input.onclick = () => {
            hintsFunc()
        }
    }
})