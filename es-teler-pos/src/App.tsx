import { useState } from 'react'
import './App.css'
import ProductList from './components/ProductList'
import { usePos } from './context/PosContext'

function App() {
  const { state, dispatch } = usePos();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const change = cashAmount - state.total;

  const handleCheckout = () => {
    if (state.total === 0) return;
    setIsCheckout(true);
  };

  const handleFinish = () => {
    setLastOrder({
      items: [...state.cart],
      total: state.total,
      cash: cashAmount,
      change: cashAmount - state.total,
      date: new Date().toLocaleString()
    });
    dispatch({ type: 'CLEAR_CART' });
    setIsCheckout(false);
    setIsSuccess(true);
  };

  const closeSuccess = () => {
    setIsSuccess(false);
    setCashAmount(0);
    setLastOrder(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Es Teler POS</h1>
      </header>
      <main className="main-content">
        <div className="product-area">
          <ProductList />
        </div>
        <aside className="cart-sidebar">
          <h2>Your Order</h2>
          {state.cart.length === 0 ? (
            <p className="empty-cart">Cart is empty</p>
          ) : (
            <div className="cart-content">
              <ul className="cart-items">
                {state.cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <div className="item-controls">
                        <button 
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                        >-</button>
                        <span className="item-qty">{item.quantity}</span>
                        <button 
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                        >+</button>
                      </div>
                    </div>
                    <div className="item-price-group">
                      <span className="item-price">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                      <button 
                        className="remove-item"
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                      >×</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <div className="total-row">
                  <span>Total</span>
                  <span className="total-amount">
                    Rp {state.total.toLocaleString('id-ID')}
                  </span>
                </div>
                <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
              </div>
            </div>
          )}
        </aside>
      </main>

      {isCheckout && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Payment</h2>
            <div className="payment-summary">
              <div className="payment-row">
                <span>Total Bill:</span>
                <strong>Rp {state.total.toLocaleString('id-ID')}</strong>
              </div>
              <div className="payment-row">
                <span>Cash Amount:</span>
                <input 
                  type="number" 
                  value={cashAmount || ''} 
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  placeholder="Enter amount..."
                  autoFocus
                />
              </div>
              <div className="payment-row change-row">
                <span>Change:</span>
                <strong className={change >= 0 ? 'positive' : 'negative'}>
                  Rp {change.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsCheckout(false)}>Cancel</button>
              <button 
                className="finish-btn" 
                disabled={change < 0 || state.total === 0}
                onClick={handleFinish}
              >
                Finish Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && lastOrder && (
        <div className="modal-overlay">
          <div className="modal-content receipt-modal">
            <h2>Success!</h2>
            <div className="receipt-content">
              <div className="receipt-header">
                <h3>ES TELER POS</h3>
                <p>{lastOrder.date}</p>
              </div>
              <div className="receipt-items">
                {lastOrder.items.map((item: any) => (
                  <div key={item.id} className="receipt-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="receipt-footer">
                <div className="receipt-row">
                  <span>Total</span>
                  <span>Rp {lastOrder.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="receipt-row">
                  <span>Cash</span>
                  <span>Rp {lastOrder.cash.toLocaleString('id-ID')}</span>
                </div>
                <div className="receipt-row">
                  <span>Change</span>
                  <span>Rp {lastOrder.change.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            <button className="finish-btn" onClick={closeSuccess}>New Transaction</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
