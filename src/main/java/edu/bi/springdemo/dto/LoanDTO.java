package edu.bi.springdemo.dto;

public class LoanDTO {
    private Integer bookID;
    private Integer userID;

    //getters & setters
    public Integer getBookID() { return bookID; }
    public void setBookID(Integer bookID) { this.bookID = bookID; }
    public Integer getUserID() { return userID; }
    public void setUserID(Integer userID) { this.userID = userID; }
}