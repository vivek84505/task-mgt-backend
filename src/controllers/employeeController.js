const pool = require("../db/database")



const getEmployees = async (req , res) => {
    
     response = {
        status : "",
        message : "",
        data:[]
     }
   
    
    try{ 
     

        const result = await pool.query(
            `select *
                from
                public.employee_one
                Where is_deleted = false
              --  and employee_code = '777'
                order by
                employee_id
                `
        )
        
        console.log("API Result======>",result)
        
        if (result.rows.length > 0 ){

                response.status = "sucessfull";
                response.message = "Data Fetched Sucesfully"
                response.data = result.rows
                res.status(200).json(response)

        }
        else{

                response.status = "sucessfull";
                response.message = "No Data Found"
                response.data = result.rows
                res.status(200).json(response)

        }

        console.log("result=======>",result)

        
 

    }
    catch(error){

             console.log("error=======>",error)

                response.status = "fail";
                response.message = "Something went wrong"              
                res.status(200).json(response)
    }


}

const getEmployeesById = async(req, res) => {

    console.log("req.params========>",req.params)
    const {id} = req.params;
    
    try{

        const result = await pool.query(
            `SELECT * 
             FROM public.employee_one
             where employee_id = $1 ` ,
             [id]
        )

        if(result.rows.length === 0){
            return res.status(404).json({
                message:"Employee Not Found"
            });
        }

        res.status(200).json(result.rows[0])
        
    }
    catch(error){
        console.log('error========>',error)

        res.status(500).json({
            message:"Internal Server Error"
        })

    }
}

 




const createEmployee = async (req , res) => {

    response = {
        status : "",
        message : "",
        data:[]
    }
   

    try {

        const {
            employee_code,
            first_name,
            last_name,
            email,
            phone,
            designation,
            department,
            date_of_joining,
            salary} = req.body;

            const result = await pool.query(
                `INSERT INTO public.employee_one
                (  employee_code,
                    first_name,
                    last_name,
                    email,
                    phone,
                    designation,
                    department,
                    date_of_joining,
                    salary)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                    RETURNING *`,
                    [
                        employee_code,
                        first_name,
                        last_name,
                        email,
                        phone,
                        designation,
                        department,
                        date_of_joining,
                        salary
                    ]

            )

            if (result.rows.length > 0){

                   response.status = "sucessfull";
                   response.message = "Employee Created Sucesfully"
                   response.data = result.rows[0]
                   res.status(201).json(response)
            }
            else{

                   response.status = "fail";
                   response.message = "Failed to create employee"
                   res.status(200).json(response)
            }
            console.log("Result =======>",result);
            
            
             

    }
    catch(error){

        
        
        console.log('Error========>',error)
      
        response.status = "fail";
        response.message = "Failed to create employee"

        res.status(200).json(response)
    }
}    


const updateEmployee = async (req, res) =>{

     response = {
        status : "",
        message : "",
        data:[]
    }

    try{

        const {id} = req.params

         const {
            employee_code,
            first_name,
            last_name,
            email,
            phone,
            designation,
            department,
            date_of_joining,
            salary} = req.body;

            const result = await pool.query(
                `Update public.employee_one
                SET
                    employee_code = $1,
                    first_name = $2,
                    last_name = $3,
                    email = $4,
                    phone = $5,
                    designation =$6,
                    department = $7,
                    date_of_joining = $8,
                    salary = $9

                    where employee_id = $10
                    RETURNING *
                `,[
                    employee_code,
                    first_name,
                    last_name,
                    email,
                    phone,
                    designation,
                    department,
                    date_of_joining,
                    salary,
                    id
                ]
            )

            console.log("Put API result ====>",result)

            if(result.rows.length > 0 && result.rowCount > 0){
               
                response.status = "sucessfull";
                response.message = "Data Updated Sucesfully"
                response.data = result.rows[0]
                res.status(200).json(response)

                
            }
            else {

                response.status = "fail";
                response.message = "Something went Wrong"             
                res.status(200).json(response)
            }



            // res.status(200).json(result.rows[0])


    }   
    catch(error){

            response.status = "fail";
            response.message = "Something went Wrong"             
            res.status(200).json(response)
    }
}

const patchEmployee = async (req, res) =>{
    
    try{
        const {id} = req.params;

        const {
            
            email,
            phone,
            designation,
            department,
            date_of_joining,
            salary} = req.body;

         const result = await pool.query(
            `Update public.employee_one
             SET
                email = COALESCE($1,email),   
                phone = COALESCE($2,phone),     
                designation = COALESCE($3,designation),
                department = COALESCE($4,department),    
                date_of_joining = COALESCE($5,date_of_joining),                         
                salary = COALESCE($6,salary)
                where employee_id = $7
                RETURNING *
            `,[
                email,
                phone,
                designation,
                department,
                date_of_joining,
                salary,
                id
            ]
         )   

           if(result.rows.length === 0){
                return res.status(404).json({
                    message:"Employee not Found"
                })
            }



            res.status(200).json(result.rows[0])

    }
    catch(error){

        console.log('error=======>',error)
        res.status(500).json({
            message:"Failed to update employee"
        })
    }
}


const deleteEmployee = async (req ,res) =>{
    
     response = {
        status : "",
        message : "",
        data:[]
    }

    try{
        
        const {id} = req.params;

        const result = await pool.query(
            `UPDATE public.employee_one
            SET is_deleted = true WHERE employee_id = $1
            RETURNING *`,
            [id]
        );

        if(result.rows.length === 0){
            response.status = "fail";
            response.message = "Employee not found"
            return res.status(200).json(response)
        }

        response.status = "sucessfull";
        response.message = "Employee deleted successfully"
        response.data =   result.rows[0]

        res.status(200).json(response)


    }
    catch(error){

          response.status = "fail"
          response.message = error
          return res.status(200).json(response)
    }
}

module.exports = {
    getEmployees,
    getEmployeesById,
    createEmployee,
    updateEmployee ,
    patchEmployee,
    deleteEmployee
}