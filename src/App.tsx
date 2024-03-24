import './App.css'

import {useAppDispatch, useAppSelector} from "./hooks.ts";
import {addTodo, removeTodo, setTodoText, Todo, toggleTodoComplete} from "./features/todo/todoSlice"
import {useState} from "react";
import _ from 'lodash'

function App() {
    let todoList = useAppSelector((state) => state.todos.todoList)
    const dispatch = useAppDispatch();

    function handleAddTodo() {
        dispatch(addTodo(
            {
                id: crypto.randomUUID(),
                text: "",
                isComplete: false,
                createdAt: new Date().getTime()
            }
        ))
    }

    // https://medium.com/@worachote/building-a-todo-list-app-with-reactjs-a-step-by-step-guide-2c58b9b6c0f5

    const [filterState, setFilterState] = useState("all")

    if(filterState === "incomplete") {
        todoList = todoList.filter((todo) => !todo.isComplete)
    }

    return (
        <>
            <h1 className={"text-center mt-8 mb-8 not-italic font-medium text-slate-500"}>Todo List</h1>
            <div className="w-4/5 mx-auto">
                {/* Dropdown Filter */}
                <div className="relative float-right mb-2">
                    <select
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                        className={"rounded-md border border-transparent px-3 py-2 focus:outline-none focus:border-gray-300 focus:ring focus:ring-opacity-40 focus:ring-blue-300 bg-slate-100 text-slate-900 cursor-pointer transition-colors"}
                    >
                        <option value="all">All</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                </div>
                <button className={"mb-4"} onClick={handleAddTodo}>Add Todo</button>
                <div className={"mx-auto rounded-lg bg-card-background shadow-md pt-6 ps-6 pe-6 pb-6 space-y-6 "}>

                    {
                        todoList.length === 0 && <EmptyTodoList/>
                    }

                    {
                        (todoList.map((todo: Todo) => <TodoItem todo={todo}/>))
                    }
                </div>
            </div>
        </>
    )
}

function EmptyTodoList() {
    return <p>Please add a todo.</p>
}

function TodoItem(props: { todo: Todo }) {
    const dispatch = useAppDispatch();

    function onCheckChanged() {
        dispatch(toggleTodoComplete(props.todo))
    }

    const [isEditing, setEditing] = useState(props.todo.text === "")
    const [text, setText] = useState(props.todo.text)

    function deleteTodo() {
        dispatch(removeTodo(props.todo))
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value)
    }

    function handleSubmit() {
        if (isEditing) {
            dispatch(setTodoText({
                todo: props.todo,
                text: text
            }));
        }
        setEditing(!isEditing)
        console.log(`handleSubmit final state ${isEditing}`)
    }

    const handleSubmitD = _.debounce(handleSubmit, 50)

    return (
        <div className={`mx-auto rounded-lg bg-white p-6 shadow-md flex flex-row items-center`}>

            <input
                className={"appearance-none w-8 h-8 rounded-sm border border-gray-300 bg-gray-100 cursor-pointer checked:bg-blue-500 after:content-['\\2713'] after:absolute after:text-gray-400 after:block after:text-center after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150 ease-in-out"}
                type={"checkbox"} checked={props.todo.isComplete} readOnly onClick={onCheckChanged}/>


            <div className="space-y-0.5 ms-16">
                {
                    (isEditing ? <input
                                className={"h-16 rounded-md border border-gray-300 appearance-none text-center text-lg p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out"}
                                autoFocus type={"text"} value={text} onChange={handleChange}
                                onBlur={() => {
                                    console.log(`onBlur ${isEditing}`)
                                    if(isEditing){
                                        handleSubmitD()
                                    }
                                }}></input>
                            : <>
                                <p onClick={handleSubmit} className={"text-lg text-black font-semibold"}>{props.todo.text}</p>
                                <p className={"text-slate-500 font-medium"}>{formatDateTime(props.todo.createdAt)}</p></>
                    )
                }
            </div>

            <div className={"items-end ml-auto"}>
                <button onClick={() => {
                    handleSubmitD()
                }}>{(isEditing ? "Done" : "Edit")}</button>
                <button className={"ms-4"} onClick={deleteTodo}>Trash</button>
            </div>
        </div>
    )
}

function formatDateTime(timestamp: number): string {
    const date = new Date(timestamp)
    return `${date.toLocaleTimeString()}, ${date.toLocaleDateString("en-AU")}`
}

export default App
