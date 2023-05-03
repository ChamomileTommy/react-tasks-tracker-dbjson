import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  //useEffect mà có mảng rỗng ở cuối nghĩa là hàm này chỉ chạy 1 lần duy nhất khi component App được khởi tạo
  useEffect(() => {
    console.log("ahoho");
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()
    //clone lại tasks lúc đầu cộng thêm task mới được thêm vào
    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
    //nếu status = 200 thì nó sẽ lọc ra những task có id khác với id của task đã bị delete
    res.status === 200
      ? setTasks(tasks.filter((task) => task.id !== id))
      : alert('Error Deleting This Task')
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    //get task theo Id
    const taskToToggle = await fetchTask(id)
    //thay đổi thuộc tính reminder của task
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    //update task vào DB
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })
    //get data của task đã được update
    const data = await res.json()
    //dùng useState để update lại list task, 
    //với điều kiện lấy ra task có id trùng với id của task đã được update (xử lý trên frontend : phản ánh task đã được update)
    //nếu lấy ra task có id không trùng với id của task đã được update (xử lý trên frontend : giữ nguyên task từ [tasks đã được gọi ra trước đó])
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  return (
    <Router>
      <div className='container'>
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            path='/'
            element={
              <>
              {/* onAdd1 là 1 thuộc tính (dạng hàm số) của component AddTask */}
                {showAddTask && <AddTask onAdd1={addTask} />}
                {tasks.length > 0 ? (
                // Component Tasks gồm thuộc tính là object tasks, thuộc tính dạng hàm onDelete và thuộc tính dạng hàm onToggle
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  'No Tasks To Show'
                )}
              </>
            }
          />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
