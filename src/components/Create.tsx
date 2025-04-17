import { useState } from "react"

export const Create = () => {
  const [creatingPost, setCreatingPost] = useState(true)

  return (
    <div className="create-container">
          <div className="create-type">
              <button className="btn btn--success btn--md" onClick={() => setCreatingPost(true)}>Post a session</button>
              <button className="btn btn--success btn--md" onClick={() => setCreatingPost(false)}>Discuss Something</button>
          </div>
          {creatingPost && <div className="create-post">
            <div className="create-type">
              <select className="create-option">
                <option>Choose a Game</option>
                <option>RDR2</option>
                <option>RDR1</option>
                <option>GTA 5</option>
                <option>GTA 6</option>
              </select>
              <select className="create-option">
                <option>What Platform</option>
                <option>Playstation</option>
                <option>XBox</option>
                <option>PC</option>
              </select>
            </div>
            <input placeholder="Enter a Title" className="create-input"/>
            <textarea placeholder="Enter a description" className="create-textarea"></textarea>
          </div>}
          {!creatingPost && <div className="create-discussion">
            <h1>Create Discussion</h1>
          </div>}
    </div>
  )
}
