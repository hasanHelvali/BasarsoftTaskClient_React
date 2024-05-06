export class Users{
    id
    name
    email
    role=[]
    constructor(id, name,email,role) {
        this.id= id;
        this.name = name;
        this.email= email;
        this.role[0]=role
      }
}