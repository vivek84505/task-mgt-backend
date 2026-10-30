
 
const pool = require("../db/database")
const Joi  = require("joi")

let response = {
        status : "",
        message:"",
        data:[]
    }


  const jresponse = (status, message, data = []) => {
    return {
        status,
        message,
        data
    };
};
  
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

//    Backend Validation starts
      console.log('req.body=========>',req.body)
   
    
   const schema = Joi.object({
        firstname:Joi.string().trim().min(2).max(10).required(),
        lastname:Joi.string().trim().min(2).max(10).required(),
        email:Joi.string().trim().email().max(25).required(),
        role:Joi.string().valid("ADMIN","USER").default("USER"),
        is_active:Joi.boolean().default(true)

   })

 const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    console.log('error=========>',error)

    if (error) {
        return res.status(400).json(
            jresponse("fail", "Validation failed",
                error.details.map(item => item.message)
            )
        );
    }
//    Backend Validation End




    const {firstname,lastname,email,role,is_active} = req.body;
    const password_hash  = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    

    try{

            // Check email exists validation start
               
            const  checkEmailResult = await pool.query(
                `
                select email from public.users where email = $1
                `,[email]
            )
            
            if (checkEmailResult.rows.length > 0){

                    response.status = "fail";
                    response.message = `${email} - Email Already Exists`
                    response.data = []
                    return res.status(200).json(response)
            }



            // Check email exists validation end

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
        // console.log("Error===>",error)
        response.status = "fail";
        response.message = error.detail
        res.status(200).json(response)
    }


   
}

const updateUser = async (req,res) => {

    const {userid} = req.params;
    const {firstname,lastname,email,role,is_active} = req.body

    console.log(" req.body======>", req.body)

    try{

        const result = await pool.query(
            `Update public.users SET
            firstname = $1, lastname = $2, email = $3, role = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP where user_id = $6  RETURNING *`,
            [firstname,lastname,email,role,is_active,userid]
        )

       if(result.rowCount > 0 && result.rows.length){
                response.status = "sucessfull";
                response.message = "Data Updated Sucesfully"
                response.data = result.rows[0]
                res.status(200).json(response)
       }
       else{

                response.status = "fail";
                response.message = "Something went Wrong"             
                res.status(200).json(response)

       }

      
    }
    catch(error){
        response.status = "fail";
        response.message = error.detail
        res.status(200).json(response)
    }



      
}

const deleteUser = async (req, res) => {
    
    const {userid} = req.params;

    try{

        const result = await pool.query(
                'update public.users SET is_deleted = true where user_id = $1 RETURNING *',[userid]                        
                )

             console.log("Result=====>",result)   

            if(result.rows.length > 0){

                response.status = "sucessfull";
                response.message = "User Deleted Sucesfully"
                response.data = result.rows[0]
                res.status(200).json(response)
            }
            else{

                response.status = "fail";
                response.message = "Something went wrong"
                response.data =[]
                res.status(200).json(response)

            }
    }   
    catch(error){

            response.status = "fail";
            response.message = error.detail
            response.data =[]
            res.status(200).json(response)
    }

}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}