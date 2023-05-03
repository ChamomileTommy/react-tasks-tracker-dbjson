import Task from './Task'

// Component Tasks cha có 3 tham số truyền vào
// 1: Object tasks
// 2: hàm onDelete
// 3: hàm onToggle
const Tasks = ({ tasks, onDelete, onToggle }) => {
  return (
    <>
      {tasks.map((task, index) => (
        <Task key={index} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </>
  )
}

export default Tasks
