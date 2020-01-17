import React, { Component } from 'react';
import {gql} from 'apollo-boost';
import {graphql} from '@apollo/react-hoc';

const getAuthorsQuery = gql`
{
  authors{
    name
    id
  }
}
`

class AddBook extends Component{
    
    render(){
      return (
        <form id="add-book">
        <div className = "field">
            <label>Bookname:</label>
            <input type="text"/>
        </div>
        
        <div className = "field">
            <label>Genre:</label>
            <input type="text"/>
        </div>
        
        <div className = "field">
            <label>Author:</label>
            <select>
                <option>Select Author</option>
            </select>
        </div>
    </form>
      );
    }
  }
  
  export default graphql(getAuthorsQuery)(AddBook);