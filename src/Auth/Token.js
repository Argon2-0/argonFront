import { ReactSession } from 'react-client-session';

class Token {
    constructor() { }

    generar() {
        fetch(ReactSession.get("basicUri") + "auth/generate", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
                id: ReactSession.get("id"),
                name: ReactSession.get("name"),
                email: ReactSession.get("email"),
                role:{
                    id: ReactSession.get("idRol"),
                    name: ReactSession.get("nameRol")
                }
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((responseToken) => responseToken.json())
            .then((jsonToken) => {
                console.log(jsonToken)
                ReactSession.set("token", jsonToken["token"]);
                ReactSession.set("expirationDate", jsonToken["expirationDate"]);
            })
    }

    validar() {
        fetch(ReactSession.get("basicUri") + "auth/validate", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify({
                id: ReactSession.get("id"),
                name: ReactSession.get("name"),
                email: ReactSession.get("email"),
                role:{
                    id: ReactSession.get("idRol"),
                    name: ReactSession.get("nameRol"),
                }
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${ReactSession.get("token")}`
            },
        })
            .then((responseToken) => responseToken.json())
            .then((jsonToken) => {
                console.log(jsonToken)
            })
    }
}

export default Token;