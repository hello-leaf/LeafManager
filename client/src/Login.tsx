import React, { useState } from "react";

function Login() {
  const [ email, setEmail ] = useState("");
  const [ pass, setPass ] = useState("");
  const [ show, setShow ] = useState(false);

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          "email": email,
          "password": pass
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if(!r.ok){
        return alert(`Request failed: ${r.statusText} with code ${r.status}`);
      }

      const res = await r.json();

      localStorage.setItem("token", res.token);
      localStorage.setItem("email", email);

      console.log(`Signed in successfully!`);
      location.reload();
    } catch (error) {
      alert(`Got error: ${error}`);
    }
  }

  return (
    <div className="form-container">
      <h2>Welcome back</h2>
      <p>Sign in to your account</p>

      <form className="form" onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
          >
            {show ? "−" : "👁"}
          </button>
        </div>

        <button className="form-submit" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
