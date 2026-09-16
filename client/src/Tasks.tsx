import React, { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([{id: -1, title: "no data", content: "no data", done: false}]);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");

  useEffect(() => {
    async function getTasks() {
      if(!localStorage.getItem("token") || localStorage.getItem("token") === "") return;
      
      try {
        const t = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
          }
        });

        setTasks(await t.json());
      } catch (error) {
        return console.error(`Got error: ${error}`);
      }
    }

    getTasks();
  }, []);

  async function deleteTask(id: number) {
    if(!localStorage.getItem("token") || localStorage.getItem("token") === "") return;
    
    try {
      const r = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
        }
      });

      if(r.ok) location.reload();
    } catch (error) {
      return console.error(`Got error: ${error}`);
    }
  };

  async function addTask(e: React.SubmitEvent<HTMLFormElement>) {
    if(!localStorage.getItem("token") || localStorage.getItem("token") === "") return;

    try {
      const r = await fetch(`/api/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
        },
        body: JSON.stringify({
          "title": title,
          "content": content,
          "done": false
        })
      });

      if(r.ok) location.reload();
    } catch (error) {
      return console.error(`Got error: ${error}`);
    }
  }

  if(!localStorage.getItem("token") || localStorage.getItem("token") === "") return (<div></div>);
  return (
    <div>
      <div className="header">
        <button onClick={() => { localStorage.removeItem("token"); location.reload(); }} className="primary-button">Sign out</button>
        <p>{localStorage.getItem("email")}</p>
        <button onClick={() => setAddTaskVisible(addTaskVisible ? false : true)} className="primary-button">+</button>
      </div>
      
      <form onSubmit={addTask} style={{display: addTaskVisible ? "block" : "none"}} className="form">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/> <br/>
        <input placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}/>

        <button type="submit" className="primary-button">Add</button>
      </form>
      <br/>
      {tasks.map((task) => (
        <div key={task.id} className={`task ${task.done ? "done" : ""}`} style={{marginBottom: "8px"}}>
          <div className="task-title">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-description">{task.content}</p>
            <button onClick={() => deleteTask(task.id)} className="icon-button delete-button">🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
