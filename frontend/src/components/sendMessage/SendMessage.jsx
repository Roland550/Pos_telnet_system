import Navbar from '../../navbar/Navbar'
import './sendMessage.css'

export default function SendMessage() {
  return (
    <>
      <Navbar />  
      <h1>Send Message</h1>
      <div className='container'>
          <form action="" className='form'>

           <div className="first-row">
            
            <input type="text" placeholder="Subject" className='add_input' />
            
           </div>
            
           
            <textarea name="" id="" cols="60" rows="5" placeholder="Type the problem face..."/><br/>
            
            <button type="button">Send message</button>
          </form>
        </div>
    </>
  )
}
