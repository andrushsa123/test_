import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const
  rows = 40,
  seatsInRow = 20;

// The seat component
function Seat(props) {
  const
    isBought = props.isBought === false ? "primary" : "dark",
    btnStyle = `btn btn-${isBought} disabled col m-1 w-5 p-20`;
  return (
    <button
      className={btnStyle}
      style={{ fontSize: "10px" }}>
      {props.seatNumber}
    </button>
  );
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seats: [],
      shopingCart: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCheckNum = this.onCheckNum.bind(this);

  }

  // Creating tickets
  componentWillMount() {
    const seats = [];
    for (let row_index = 0; row_index < rows; row_index++) {
      const isRowFirst = row_index > 0 ? seatsInRow : 0;
      seats.push([]);
      for (let seat_index = 0; seat_index < seatsInRow; seat_index++) {
        const seatObject = {
          isBought: Math.random() >= 0.5,
          seatNumber: (seat_index + 1) + (isRowFirst * row_index)
        };
        seats[row_index].push(seatObject);
      }
    }
    this.setState({ seats: seats });

  }
  // Checking the form 
  onCheckNum(num) {
    let
      freeSeatsNum = 0,
      isLessThenFreeSeats = true;

    this.state.seats.map(row => row.map(seat => {
      if (!seat.isBought) freeSeatsNum++;
      return null;
    }))

    if (num >= freeSeatsNum) isLessThenFreeSeats = false;

    return isLessThenFreeSeats;
  }

  // The form submiting
  handleSubmit(event) {

    event.preventDefault();


    let buyNumber = event.target.buyNumber.value;
    const shopingCart = this.state.shopingCart;

    if (this.onCheckNum(buyNumber)) {
      this.state.seats.map(row => row.map(seat => {
        if (!seat.isBought && buyNumber > 0) {

          seat.isBought = true;

          const shopObj = {
            isBought: true,
            seatNumber: seat.seatNumber
          };

          shopingCart.push(shopObj);

          buyNumber--;
        }
        return null;

      }));

    } else {
      alert('Please enter a lower number');
    }


    this.setState({ shopingCart: shopingCart });
  }
  // reomoving the order
  onDelete(seatNumber, event) {
    event.preventDefault();
    const
      cart = this.state.shopingCart,
      seats = this.state.seats;

    cart.map((cart_obj, cart_i) => {
      if (cart_obj.seatNumber === seatNumber) {
        cart.splice(cart_i, 1);


        seats.map(row => row.map(seat => {
          if (seat.isBought && seat.seatNumber === cart_obj.seatNumber) {

            seat.isBought = false;
          }
          return null;
        }));

      }
      return null;
    })

    this.setState({ shopingCart: cart, seats: seats });
  }



  render() {
    return (
      <div className="container">
        <div>
          {this.state.seats.map((row, row_i) => {
            return (
              <div
                className="row"
                key={row_i.toString()}
                style={{ flexWrap: "nowrap" }}>

                {
                  this.state.seats[row_i]
                    .map((seat, seat_i) =>
                      <Seat
                        seatNumber={seat.seatNumber}
                        isBought={seat.isBought}
                        key={seat_i.toString()}
                      />)
                }

              </div>)
          })}
        </div>

        <br />
        <div className="row">
          <div className="col-8">
            <form onSubmit={this.handleSubmit}>

              <label>Number of tickets</label>

              <div className="form-row">
                <div className="form-group col-6">
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    name="buyNumber" />
                </div>
                <div className="col-6">
                  <button className="btn btn-primary col-6">
                    Buy
                  </button>
                </div>

              </div>

            </form>
          </div>
          <div className="col-4">
            <div>Shoping cart</div>
            <br/>
            <ul
              className="list-group overflow-auto"
              style={{ height: "300px" }}>
              {this.state.shopingCart.map((cart_obj, cart_i) => (
                <li
                  key={cart_i}
                  className="list-group-item">
                  {cart_obj.seatNumber}

                  <button
                    type="button"
                    className="close btn btn-outline-light"
                    aria-label="Close"
                    onClick={(e) => this.onDelete(cart_obj.seatNumber, e)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
    );
  }
}
export default App;
