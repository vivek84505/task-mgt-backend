
 
const pool = require("../db/database")

let response = {
        status : "",
        message:"",
        data:[]
    }

const getUsers = async (req,res) => {

   
    
    try{

        const result = await pool.query(
            `select
	            user_id,
                firstname,
                lastname,
                email,
                role,
                is_active,
                created_at,
                updated_at
            from
	            public.users`

        )

        if(result.rows.length > 0){

            response.status = "sucessfull",
            response.message = "Data Fetched succesfully"
            response.data = result.rows

            res.status(200).json(response)
        }
        else{

            response.status = "sucessfull",
            response.message = "No Data Found"
            response.data = result.rows

            res.status(200).json(response)
        }

    }
    catch(error){
        //Error handling code
            response.status = "fail",
            response.message = error
            response.data = []


    }




}

const getUserById = async (req,res) => {

    const {userid} = req.params;
    
    try{

        const result = await pool.query(
            `select
	            user_id,
                firstname,
                lastname,
                email,
                role,
                is_active,
                created_at,
                updated_at
            from
	            public.users
            where user_id = $1`, [userid]
        )

        if(result.rows.length > 0){

            response.status = "sucessfull",
            response.message = "Users fetched sucessfully"
            response.data = result.rows[0]

            res.status(200).json(response)
        }
        else{
            
            response.status = "sucessfull",
            response.message = "Data Not Found"
            response.data = []
            res.status(200).json(response)
        
        }


    }
    catch(error){

        response.status = "fail",
        response.message = error
        response.data = []
        res.status(200).json(response)
    }
}

const createUser = async (req,res) => {

    const {firstname,lastname,email,role,is_active} = req.body;
    const password_hash  = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    console.log("password_hash========>",password_hash)
    console.log("body========>",req.body)
    

    try{

                const result = await pool.query(
            `    
                INSERT into public.users
                (
                    firstname,
                    lastname,
                    email,
                    role,
                    is_active,
                    password_hash,
                    created_at,
                    updated_at
                )
                    VALUES ( $1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) RETURNING *`,
                    [firstname,
                    lastname,
                    email,
                    role,
                    is_active,
                    password_hash] 
            
            ) 

            if (result.rows.length > 0){

                    response.status = "sucessfull";
                    response.message = "User Created Sucesfully"
                    response.data = result.rows[0]
                    res.status(200).json(response)
            }
            else{
                    response.status = "fail";
                    response.message = "Failed to create user"
                    res.status(200).json(response)
            }

    }
    catch(error){

        response.status = "fail";
        response.message = error
        res.status(200).json(response)
    }


   
}

module.exports = {
    getUsers,
    getUserById,
    createUser
}