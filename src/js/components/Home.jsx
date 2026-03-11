import React, { useState, useEffect } from "react";

const Home = () => {
  const [todos, setTodos] = useState([]);

  const createUser = async () => {
    try {
      const res = await fetch(
        "https://playground.4geeks.com/todo/users/moufdi23",
        {
          method: "POST",
        },
      );
      console.log("createUser status:", res.status);
    } catch (err) {
      console.warn("createUser error:", err);
    }
  };

  useEffect(() => {
    createUser().then(() => {
      getTodos();
    });
  }, []);

  const getTodos = async () => {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/todo/todos/moufdi23",
      );
      console.log("getTodos status:", response.status);

      if (!response.ok) {
        console.warn("getTodos response not ok:", response.status);
        setTodos([]);
        return;
      }

      const data = await response.json();
      console.log("getTodos data:", data);
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("getTodos error:", err);
      setTodos([]);
    }
  };

  const addTodo = async (label) => {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/todo/todos/moufdi23",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: label, is_done: false }),
        },
      );

      const text = await response.text();
      console.log("addTodo status:", response.status, "body:", text);

      if (!response.ok) {
        console.warn("addTodo failed:", response.status, text);
        return;
      }

      let created;
      try {
        created = JSON.parse(text);
      } catch {
        created = null;
      }

      if (created && created.id !== undefined) {
        setTodos((prev) => [...prev, created]);
      } else {
        await new Promise((r) => setTimeout(r, 300));
        getTodos();
      }
    } catch (err) {
      console.warn("addTodo error:", err);
      getTodos();
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "DELETE",
        },
      );
      console.log("deleteTodo status:", response.status);

      if (response.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } else {
        console.warn("deleteTodo failed:", response.status);

        getTodos();
      }
    } catch (err) {
      console.warn("deleteTodo error:", err);
      getTodos();
    }
  };

  const updateTodo = async (id, isDone) => {
    try {
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_done: !isDone }),
        },
      );
      console.log("updateTodo status:", response.status);

      if (response.ok) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_done: !isDone } : t)),
        );
      } else {
        console.warn("updateTodo failed:", response.status);
        getTodos();
      }
    } catch (err) {
      console.warn("updateTodo error:", err);
      getTodos();
    }
  };

  return (
    <div>
      <h1>Todo App</h1>

      <input
        type="text"
        placeholder="Add a new todo"
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            const value = e.target.value.trim();
            e.target.value = "";
            if (!value) return;
            await addTodo(value);
          }
        }}
      />

      {!Array.isArray(todos) || todos.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No tasks yet — add one above!</p>
      ) : (
        <ul>
          {todos.map((item) => (
            <li key={item.id} style={{ marginBottom: "10px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="checkbox"
                  checked={item.is_done}
                  onChange={() => updateTodo(item.id, item.is_done)}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: item.is_done ? "line-through" : "none",
                    opacity: item.is_done ? 0.5 : 1,
                  }}
                >
                  {item.label}
                </span>
                <button onClick={() => deleteTodo(item.id)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
