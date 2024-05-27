import { Container } from "react-bootstrap"
export const AddEmployee = () => {
    return(
       <>
       <div className="form-header">
       <h2>Employee Management</h2>
       </div>      
       <Container>
       <form>
            <div className="form-group">
            <label>First Name:</label>
            <input type="text" className="form-control" name="firstname" value="" placeholder="Enter FirstName"></input>
            </div>
           <div className="form-group">
           <label>Last Name:</label>
            <input type="text" className="form-control" name="lastname" value="" placeholder="Enter LastName"></input>
           </div>
           <div className="form-group">
            <label>Email:</label>
            <input type="email" className="form-control" name="email" value="" placeholder="Enter Email"></input>
           </div>
           <div className="form-group">
           <label>Age:</label>
            <input type="text" className="form-control" name="age" value="" placeholder="Enter Age"></input>
           </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="male" id="male" />
              <label className="form-check-label" htmlFor="male">
                Male
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="female" id="female" />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="other" id="other" />
              <label className="form-check-label" htmlFor="other">
                Other
              </label>
            </div>
        </form>
       </Container>
       
       </>
    )
}