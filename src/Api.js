const host = 'http://localhost:3000/';

export default {
    list () {
        let url = host + 'todos';
        var headers = new Headers();
        let opt = { headers };
        return fetch(url, opt).then((resp)=>{
            if (!resp.ok) {
                let message = `${url} response ${resp.status}`;
                throw message;
            } else {
                return resp.json();
            }
        });
    },

    add (content) {
        let url = host + 'todos';
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let opt = { 
            method: 'POST',
            body: JSON.stringify({content}),
            headers: headers 
        };
        return fetch(url, opt).then((resp)=>{
            if (!resp.ok) {
                let message = `${url} response ${resp.status}`;
                throw message;
            } else {
                return resp.json();
            }
        });
    },

    toggle (id, done) {
        let url = host + 'todos/' + id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Cache-Control', 'no-cache');
        let opt = { 
            method: 'PATCH',
            body: JSON.stringify({done : done ? 1 : 0}),
            headers: headers 
        };
        return fetch(url, opt).then((resp)=>{
            if (!resp.ok) {
                let message = `${url} response ${resp.status}`;
                throw message;
            } else {
                return resp.json();
            }
        });
    },

    modifyContent(id, content) {
        let url = host + 'todos/' + id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Cache-Control', 'no-cache');
        let opt = { 
            method: 'PATCH',
            body: JSON.stringify({content}),
            headers: headers 
        };
        return fetch(url, opt).then((resp)=>{
            if (!resp.ok) {
                let message = `${url} response ${resp.status}`;
                throw message;
            } else {
                return resp.json();
            }
        });
    },

    remove(id) {
        let url = host + 'todos/' + id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let opt = { 
            method: 'DELETE',
            headers: headers 
        };
        return fetch(url, opt).then((resp)=>{
            if (!resp.ok) {
                let message = `${url} response ${resp.status}`;
                throw message;
            } else {
                return resp.json();
            }
        });
    }
}