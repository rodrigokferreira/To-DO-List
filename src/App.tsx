import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import "./App.css"

function App() {

  const inputRef = useRef<HTMLInputElement>(null)
  const firstRender = useRef(true)

  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState<string[]>([])

  const [editTask, setEditTask] = useState({
    enable: false,
    task: ''
  })

  useEffect(() => {
    const savedTasks = localStorage.getItem("@cursoreact")

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        console.error("Erro ao analisar JSON armazenado:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    localStorage.setItem("@cursoreact", JSON.stringify(tasks))
  }, [tasks])

  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Preencha o nome da sua tarefa!")
      return
    }

    if (editTask.enable) {
      handleSaveEdit()
      return
    }

    setTasks(prevTasks => [...prevTasks, input])
    setInput("")
  }, [input, tasks])

  const handleSaveEdit = () => {
    const taskIndex = tasks.findIndex(task => task === editTask.task)
    const updatedTasks = [...tasks]

    updatedTasks[taskIndex] = input
    setTasks(updatedTasks)

    setEditTask({
      enable: false,
      task: ''
    })
    setInput("") 
  }

  const handleDelete = (item: string) => {
    const filteredTasks = tasks.filter(task => task !== item)
    setTasks(filteredTasks)
  }

  const handleEdit = (item: string) => {
    inputRef.current?.focus()

    setInput(item)
    setEditTask({
      enable: true,
      task: item
    })
  }

  const totalTarefas = useMemo(() => {
    return tasks.length
  }, [ tasks])

  return (
    <div className='container'>
      <h1>Lista de tarefas</h1>
      <input
        placeholder='Digite o nome da tarefa....'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='inputEl'
        ref={inputRef}
      />
      <button
        className='buttonEl'
        onClick={handleRegister}>
        {editTask.enable ? "Atualizar tarefa" : "Adicionar tarefa"}
      </button>
      <hr />

      <strong>Você tem {totalTarefas} tarefas!</strong>
      <br /> <br />

      {tasks.map((item) => (
        <section key={item} className='sectionEl'>
          <span>{item}</span>
          <button className='buttonEdit' onClick={() => handleEdit(item)}>Editar</button>
          <button className='buttonDelete' onClick={() => handleDelete(item)}>Excluir</button>
        </section>
      ))}
    </div>
  )
}

export default App
