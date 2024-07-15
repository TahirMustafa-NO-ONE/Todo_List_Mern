// import { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import { FaEdit } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";
// import { v4 as uuidv4 } from 'uuid';

// function App() { 
//   const [todo, setTodo] = useState("");
//   const [todos, setTodos] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [showFinished, setShowFinished] = useState(true);

//   useEffect(() => {
//       const todoString = localStorage.getItem("todos");
//       if (todoString) {
//         const todoos = JSON.parse(todoString);
//         setTodos(todoos);
//       }
//   }, []);

//   const saveToLS = () => {
//     localStorage.setItem("todos", JSON.stringify(todos));
//     // console.log('todo '+todos)
//   };

//   const toggleFinished = (e) => {
//     setShowFinished(!showFinished)
//   }

//   const handleEdit = (e, id) => {
//     e.preventDefault();
//     const t = todos.find((i) => i.id === id);
//     if (t) {
//       setTodo(t.todo);
//       setEditId(id);
//     }
//   };

//   const handleUpdate = () => {
//     if (todo.trim() && editId) {
//       const updatedTodos = todos.map((item) =>
//         item.id === editId ? { ...item, todo } : item
//       );
//       setTodos(updatedTodos);
//       setTodo("");
//       setEditId(null);
//       saveToLS();
//     }
//   };

//   const handleDelete = async (e, id) => {
//     const newTodos = todos.filter(item => item.id !== id);
//     await setTodos(newTodos);
//     saveToLS();
//   };

//   const handleAdd= ()=>{
//         setTodos([...todos, {id: uuidv4(), todo, isCompleted: false}])
//         setTodo("") 
//         saveToLS()
//       }

//   const handleChange = (e) => {
//     setTodo(e.target.value);
//   };

//   const handleCheckbox = (e) => {
//     const id = e.target.name;
//     const index = todos.findIndex(item => item.id === id);
//     const newTodos = [...todos];
//     newTodos[index].isCompleted = !newTodos[index].isCompleted;
//     setTodos(newTodos);
//     saveToLS();
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 backdrop-blur-lg min-h-[80vh] md:w-[35%] bg-opacity-60 shadow-2xl">
//         <h1 className='font-bold text-center text-4xl'>morTodo</h1>
//         <div className="addTodo my-5 flex flex-col gap-4">
//           <h2 className='text-2xl font-bold'>{editId ? 'Edit a Todo' : 'Add a Todo'}</h2>
//           <div className="flex">
//             <input 
//               onChange={handleChange} 
//               value={todo} 
//               type="text" 
//               className='w-full rounded-full px-5 py-1' 
//             />
//             <button 
//               onClick={editId ? handleUpdate : handleAdd} 
//               disabled={todo.length <= 3} 
//               className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'
//             >
//               {editId ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </div>
//         <input 
//           className='my-4' 
//           id='show' 
//           onChange={toggleFinished} 
//           type="checkbox" 
//           checked={showFinished} 
//         /> 
//         <label className='mx-2' htmlFor="show">Show Finished</label> 
//         <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
//         <h2 className='text-2xl font-bold'>Your Todos</h2>
//         <div className="todos">
//           {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
//           {todos.map(item => 
//             (showFinished || !item.isCompleted) && (
//               <div key={item.id} className="todo flex my-3 justify-between">
//                 <div className='flex gap-5'> 
//                   <input 
//                     name={item.id} 
//                     onChange={handleCheckbox} 
//                     type="checkbox" 
//                     checked={item.isCompleted} 
//                   />
//                   <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
//                 </div>
//                 <div className="buttons flex h-full">
//                   <button 
//                     onClick={(e) => handleEdit(e, item.id)} 
//                     className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
//                   >
//                     <FaEdit />
//                   </button>
//                   <button 
//                     onClick={(e) => handleDelete(e, item.id)} 
//                     className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
//                   >
//                     <AiFillDelete />
//                   </button>
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { LuClipboardEdit } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import tablet from './components/tablet.png'

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showFinished, setShowFinished] = useState(true);
  const [deletingId, setdeletingId] = useState(null)

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:5555/todos');
    const data = await response.json();
    setTodos(data);
  };

  const toggleFinished = (e) => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    const t = todos.find((i) => i.id === id);
    if (t) {
      setTodo(t.todo);
      setEditId(id);
    }
  };

  const handleUpdate = async () => {
    if (todo.trim() && editId) {
      const updatedTodo = { todo };
      const response = await fetch(`http://localhost:5555/todos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo)
      });
      const data = await response.json();
      setTodos(todos.map((item) => item.id === editId ? data : item));
      setTodo("");
      setEditId(null);
    }
  };

  const handleDelete = async (e, id) => {
    setdeletingId(id);
    setTimeout(async () => {
      await fetch(`http://localhost:5555/todos/${id}`, {
        method: 'DELETE'
      });
      setTodos(todos.filter(item => item.id !== id));
      setdeletingId(null)
    }, 500);
    
  };

  const handleAdd = async () => {
    const newTodo = { id: uuidv4(), todo, isCompleted: false };
    const response = await fetch('http://localhost:5555/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    const data = await response.json();
    setTodos([...todos, data]);
    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = async (e) => {
    const id = e.target.name;
    const index = todos.findIndex(item => item.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;

    const updatedTodo = { isCompleted: newTodos[index].isCompleted };
    await fetch(`http://localhost:5555/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo)
    });
    setTodos(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 backdrop-blur-lg min-h-[80vh] md:w-[35%] bg-opacity-60 shadow-2xl">
        <div className='flex justify-center'>
          <img src={tablet} alt="Tablet image" className="w-16 h-16" />
          <h1 className='font-bold text-center text-4xl pt-3 heading'>morTodo</h1>
        </div>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold'>{editId ? 'Edit a Todo' : 'Add a Todo'}</h2>
          <div className="flex">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className='w-full rounded-full px-5 py-1'
            />
            <button
              onClick={editId ? handleUpdate : handleAdd}
              disabled={todo.length <= 3}
              className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'
            >
              {editId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
        <input
          className='my-4'
          id='show'
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className='mx-2' htmlFor="show">Show Finished</label>
        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
        <h2 className='text-2xl font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
          {todos.map(item =>
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className={`todo flex my-3 justify-between rounded-lg adtodo ${deletingId === item.id ? 'slide-out' : ''}`}>
                <div className='flex gap-5'>
                  <input
                    className='styled-checkbox'
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div className={`font-medium ${item.isCompleted ? "line-through" : ""}`}>
                    {item.todo}
                  </div>
                </div>
                <div className="buttons flex h-full">
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  >
                    <LuClipboardEdit />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'
                  >
                    <RiDeleteBin5Line />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
