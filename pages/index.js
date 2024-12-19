import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Start from "../components/Start/Start";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { AuthContext } from "../contexts/AuthContext";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default function Home() {
  const [ isSubmitButtonHidden, setIsSubmitButtonHidden ] = useState(false);
  const [user, setUser] = useState("");
  const [comments, setComments] = useState([]);
  const [formState, setFormState] = useState({
    title: "",
    content: "",
  });

  // const baseUrl =
  //   process.env.NODE_ENV === "production"
  //     ? "https://comments-section-server-rrich.herokuapp.com"
  //     : "http://localhost:3001";

  const baseUrl = "https://comments-section-server-rrich.herokuapp.com";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUser(jwt_decode(localStorage.getItem("token")).data);
      setFormState({
        ...formState,
        user_id: user.id,
      });
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get(`${baseUrl}/interactive-comments-section/api/comments`)
        .then((response) => setComments(response.data));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const submitComment = () => {
    setIsSubmitButtonHidden(true);
    axios.post(`${baseUrl}/interactive-comments-section/api/comments`, {
      title: formState.title,
      content: formState.content,
      user_id: user.id,
    });
    setTimeout(() => window.location.reload(), 500);
  };

  const vote = (commentId, actionType, upvoteUri, downvoteUri) => {
    fetch(actionType === "upvote" ? upvoteUri : downvoteUri, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        comment_id: commentId,
      }), 
    })
      .then((response) => {
        window.location.replace("/");
      })
      .catch((err) => {
        console.error("Error", err);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <>
      {user === "" && <Start baseUrl={baseUrl} />}
      <div className="app">
        <div className="comments-container">
          <div className="comments">
            {comments.length !== 0 &&
              comments.map((comment) => (
                <div className="comment" key={comment.id}>
                  <div
                    className="up-arrow"
                    onClick={() =>
                      vote(
                        comment.id,
                        "upvote",
                        `${baseUrl}/interactive-comments-section/api/upvote`,
                        `${baseUrl}/interactive-comments-section/api/downvote`
                      )
                    }
                  >
                    <ThumbUpIcon />
                    {comment.upvotes.length}
                  </div>
                  <div
                    className="down-arrow"
                    onClick={() =>
                      vote(
                        comment.id,
                        "downvote",
                        `${baseUrl}/interactive-comments-section/api/upvote`,
                        `${baseUrl}/interactive-comments-section/api/downvote`
                      )
                    }
                  >
                    <ThumbDownAltIcon />
                    {comment.downvotes.length}
                  </div>
                  <div className="user">{`User:  ${comment.user.email}`}</div>
                  <h3>{comment.title}</h3>
                  <p>{comment.content}</p>
                </div>
              ))}
          </div>
          <div className="add-comment-container"></div>
          <form className="comment-form">
            <input
              name="title"
              id="title"
              onChange={handleChange}
              placeholder="Enter comment title here"
            ></input>
            <input
              className="add-comment"
              name="content"
              id="content"
              placeholder="Enter comment here"
              onChange={handleChange}
            ></input>
            {
              isSubmitButtonHidden === false &&
              <button className="submit-btn" onClick={submitComment}>
                Submit!
              </button>
            }
          </form>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <style jsx>{`
        .logout-btn {
          position: absolute;
          top: 5px;
          right: 15px;
          width: 125px;
          height: 50px;
          margin-top: 10px;
          border-radius: 5px;
          border: none;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: 0.25s;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }
      `}</style>
    </>
  );
}
