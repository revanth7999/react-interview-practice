import { useState } from 'react'

export default function TodoApplication() {
    const [inputValue, setInputValue] = useState("");
    const [todoItems, setTodoItems] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const setTodo = () =>{
        if (editIndex != null){
               setTodoItems(prev =>
                prev.map((item, i) =>
                    i === editIndex ? inputValue.trim() : item
                )
            );
        } else{
            setTodoItems(prev => [...prev, inputValue.trim()]);
        }
        setInputValue('');
    }

    const removeTodoItem = (index) =>{
        setTodoItems(prev => prev.filter((_, i)=> i!= index ))
    }

     const editTodoItem = (index) => {
        setInputValue(todoItems[index]);
        setEditIndex(index);
    }
  return (
    <div className="component-demo todo-demo">
        <h3 className="debounce-demo-title">Your tasks</h3>
        <p className="debounce-demo-caption">A simple place to keep track of things to do.</p>
        <div className="todo-entry">
        <input
            type="text"
            placeholder="Add a task..."
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)}
        />
        <button className="demo-primary-button" onClick={setTodo}>{editIndex !== null ? 'Save' : 'Add task'}</button>
        </div>

        <h4 className="todo-section-label">Todo items <span>{todoItems.length}</span></h4>
        {todoItems.length > 0 ?
        <ul className="demo-list todo-list">
            {todoItems.map((item, index)=>(
                <li className="todo-list-item" key={index}>
                    <span className="todo-item-label">{item}</span>
                    <span className="todo-actions">
                        <button className="demo-action-button" onClick={()=>editTodoItem(index)}>Edit</button>
                        <button className="demo-action-button delete-action" onClick={()=>removeTodoItem(index)}>Delete</button>
                    </span>
                </li>
            ))
            }
            </ul> : <p className="demo-empty todo-empty">No tasks yet. Add one above to get started.</p>}
    </div>
  )
}
