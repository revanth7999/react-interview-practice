import { useEffect, useState } from 'react'

/*
Goal:   Build a search input in React that filters a list of users.
        Implement a debounce of 500ms so that the search operation doesn't execute on every keystroke.

Process:Don't search immediately.
        Wait for 500ms.
        If the user types another character during that time, reset the timer.
        Execute the search only after the user stops typing for 500ms.
*/
export default function DebounceSearch() {
    const users = [
        "Revanth",
        "Rahul",
        "Rajesh",
        "Ramesh",
        "John ki",
        "David"
    ];
    const [userInput, setUserInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState("");

     // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(userInput);
        }, 500);

        // Cleanup previous timer
        return () => {
            clearTimeout(timer);
        };

    }, [userInput]);

    const filteredUsers = users.filter((user)=>
        user.toLocaleLowerCase().includes(debouncedSearch.toLocaleLowerCase())
    )
  return (
    <div className="component-demo">
        <h3 className="debounce-demo-title">Find a user</h3>
        <p className="debounce-demo-caption">Results update 500ms after you stop typing.</p>
        <input 
            type="text"
            placeholder="Search Users"
            value={userInput}
            onChange={(e)=>setUserInput(e.target.value)}
        />

        {filteredUsers.length > 0 ? (
            <ul className="demo-list">
                {filteredUsers.map((user) => <li key={user}>{user}</li>)}
            </ul>
        ) : <div className="demo-empty">No users found.</div>}
    </div>
  )
}
