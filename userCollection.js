/**
 * Created by Олег Шиловский on 25.11.2016.
 */





class usersCollection extends Array {

    constructor() {
        super();
    }

    add(name, score) {
        this.push(new user(name, score));
    }

    addItem(item) {
        return this.push(item);
    }

    setUsersScore(name,score){
        for(let u of this){
            if (u.name == name){
                u.score = score;
            }
        }
    }

    deleteuser(name){
        for(let u of this){
            if (u.name == name){
                this.pop(); break;
            }
        }

    }


    getNUsers(limit,offset){

        return limit>0? this.slice(offset,offset+limit):this;
    }

    killThemAll(){
        this.length = 0;
    }
}

module.exports=usersCollection;
