const Header = (props) => {
  // console.log(props)
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  // console.log(props)
  return <p>{props.part} {props.exercises}</p>
}


const Content = (props) => {
  const part1 = props.parts[0]
  const part2 = props.parts[1]
  const part3 = props.parts[2]
  return (
    <div>
      <Part part={part1.name} exercises={part1.exercise}/>
      <Part part={part2.name} exercises={part2.exercise}/>
      <Part part={part3.name} exercises={part3.exercise}/>
    </div>
    
  )
}

const Total = (props) => {
  // console.log(props)
  return (
    <p>Number of exercises {props.parts[0].exercise + props.parts[1].exercise + props.parts[2].exercise}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
    {
      name: 'Fundamentals of React',
      exercise: 10
    },
    {
      name: 'Using props to pass data',
      exercise: 7
    },
    {
      name: 'State of a component',
      exercise: 14
    }
  ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}


export default App;