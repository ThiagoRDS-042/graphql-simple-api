```mermaid
erDiagram

        Role {
            ADMIN ADMIN
CUSTOMER CUSTOMER
SELLER SELLER
        }
    


        Category {
            ELECTRONICS ELECTRONICS
BOOKS BOOKS
SPORTS SPORTS
GAMES GAMES
FASHION FASHION
        }
    
  users {
    String id PK 
    String name  
    String email  
    String document  
    String password  
    String phone  
    Role role  
    DateTime created_at  
    DateTime updated_at  
    DateTime deleted_at  "nullable"
    }
  

  products {
    String id PK 
    String name  
    Float price  
    Category category  
    String description  "nullable"
    String user_id  
    DateTime created_at  
    DateTime updated_at  
    DateTime deleted_at  "nullable"
    }
  

  stocks {
    String id PK 
    Int amount  
    String product_id  
    DateTime created_at  
    DateTime updated_at  
    DateTime deleted_at  "nullable"
    }
  

  orders {
    String id PK 
    Float price  
    Int amount  
    String product_id  
    String user_id  
    DateTime created_at  
    DateTime updated_at  
    DateTime deleted_at  "nullable"
    }
  
    users o|--|| Role : "enum:role"
    products o|--|| Category : "enum:category"
    products o{--|| users : "user"
    stocks o|--|| products : "product"
    orders o{--|| products : "product"
    orders o{--|| users : "user"
```
