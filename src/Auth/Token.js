class Token {
    constructor() { }

    generar() {
        fetch(window.$basicUri + "auth/generate", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
                id: window.$id,
                name: window.$name,
                email: window.$email,
                role:{
                    id: window.$idRol,
                    name: window.$nameRol
                }
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((responseToken) => responseToken.json())
            .then((jsonToken) => {
                console.log(jsonToken)
                window.$token = jsonToken["token"];
                window.$expirationDate = jsonToken["expirationDate"];
            })
    }

    validar() {
        fetch(window.$basicUri + "auth/validate", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
                id: window.$id,
                name: window.$name,
                email: window.$email,
                role:{
                    id: window.$idRol,
                    name: window.$nameRol,
                }
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${window.$token}`
            },
        })
            .then((responseToken) => responseToken.json())
            .then((jsonToken) => {
                console.log(jsonToken)
            })
    }
}

export default Token;