import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface TodoState {
    todoList: Todo[]
}

export interface Todo {
    id: string,
    isComplete: boolean
    text: string,
    createdAt: number,
}

const initialState: TodoState = {
    todoList: []
}

const todoSlice = createSlice({
    name: "TodoList",
    initialState: initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<Todo>) => {
            // todo check if with need to create a new array
            state.todoList.push(action.payload)
        },
        removeTodo: (state, action: PayloadAction<Todo>) => {
            state.todoList = state.todoList.filter((it) => it.id != action.payload.id)
        },
        toggleTodoComplete: (state, action: PayloadAction<Todo>) => {
            const todo = state.todoList.filter((it) => it.id === action.payload.id)[0]
            todo.isComplete = !todo.isComplete
        },
        setTodoText(state, action: PayloadAction<{
            todo: Todo,
            text: string,
        }>) {
            const todo = state.todoList.find((it) => it.id === action.payload.todo.id)
            if(!todo){
                return
            }
            todo.text = action.payload.text
        }
    }
})

export const { addTodo, removeTodo, toggleTodoComplete, setTodoText } = todoSlice.actions
export default todoSlice.reducer