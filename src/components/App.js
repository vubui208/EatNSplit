import React from "react";
import { initialFriends } from "./initialFriends";
import reactDom from "react-dom";
import { useState } from "react";
function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  function handleAddFriend({ name, image, id }) {
    if (name || image)
      setFriends((friends) => [...friends, { name, image, balance: 0, id }]);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    ); // update for react re-render the friendlist
  }
  function handleShowAddFriend() {
    setIsOpen(!isOpen);
  }
  function handleSelection(friend) {
    setSelectedFriend(selectedFriend === friend ? null : friend);
    setIsOpen(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          initialFriends={friends}
          setSelectedFriend={handleSelection}
          selectedFriend={selectedFriend}
        />
        <FormsAddFriend
          friends={friends}
          handleAddFriend={handleAddFriend}
          handleShowAddFriend={handleShowAddFriend}
          isOpen={isOpen}
        />
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplit={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}
function FriendList({ initialFriends, setSelectedFriend, selectedFriend }) {
  const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          setSelectedFriend={setSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, setSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <>
      <li>
        <img src={friend.image} alt="" />

        <h3>{friend.name}</h3>
        {friend.balance === 0 ? (
          <p>You and {friend.name} are even</p>
        ) : friend.balance > 0 ? (
          <p className="green">
            {friend.name} owes you ${Math.abs(friend.balance)}
          </p>
        ) : (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        )}
        <Button onClick={() => setSelectedFriend(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormsAddFriend({ handleAddFriend, handleShowAddFriend, isOpen }) {
  function handleSubmit(e) {
    const id = crypto.randomUUID();
    const newFriend = { name, image: `${image}?=${id}` };
    e.preventDefault();
    handleAddFriend(newFriend);
    handleShowAddFriend();
    setName("");
  }
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  return (
    <>
      {isOpen && (
        <form className="form-add-friend" onSubmit={handleSubmit}>
          <label>🧑‍🤝‍🧑Friend Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>🖼️ Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>
      )}
      <Button onClick={() => handleShowAddFriend()}>
        {isOpen ? "Close" : "Add Friend"}
      </Button>
    </>
  );
}

function FormSplitBill({ selectedFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendExpense = bill - myExpense > 0 ? bill - myExpense : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myExpense) return;
    if (whoIsPaying === "user") {
      onSplit(Number(bill) - Number(myExpense));
    } else {
      onSplit(-Number(myExpense));
    }
    setBill("");
    setMyExpense("");
    setWhoIsPaying("user");
  }
  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split a bill with {selectedFriend.name}</h2>
        <label>💵Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />
        <label>🙍‍♂️Your expense</label>
        <input
          type="text"
          value={myExpense}
          onChange={
            (e) =>
              setMyExpense(Number(e.target.value) > bill ? 0 : e.target.value) // khong duoc lon hon bill
          }
        />
        <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense </label>
        <input type="text" disabled value={friendExpense} />
        <label>🤑Who is paying the bill</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
        <Button>Split bill</Button>
      </form>
    </>
  );
}
export default App;
