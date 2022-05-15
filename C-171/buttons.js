//----------------------------------------------------------------------C-168----------------------------------------------------------------//
//----------------------------------------------------------------Automobiles Galore----------------------------------------------------------------//
//--------------------------------------------------------------------buttons.js-----------------------------------------------------------------//

//Registering a component to create html buttons 
AFRAME.registerComponent("button-renderer",{

    //Schema
    schema:{
        assorted_vals:{type:"array",default:[]},
        user_data_vals:{type:"array",default:[]},
        filtered_document:{type:"array",default:[]},
        user_email:{type:"string",default:""}
    },

    //Calling an async init function
    init: async function(){
        
        //Calling a function to initiate login and sign up procedures
        this.initiateLoginAndSignUpPrompt()

        //Delcaring an new variable "automobiles" and assigning it to a function ~~(iv)
        var automobiles;
        automobiles=await this.getAutomobiles();
      
        //Declaring a new variable "users" and assigning it to a function ~~(v)
        var users;
        users= await this.getUsers()
  
        //Filtering out the selected automobile in accordance with the required id
        sel_automobile=automobiles.filter(automobile=>automobile.id==="pagani_huayra_car_01")[0]
        
        //Sourcing the key and values of the variable, holding a dicitonary, at (i)
        key_vals=Object.keys(sel_automobile.info_modal["specs"]) //~~(ii)
        value_vals=Object.values(sel_automobile.info_modal["specs"]) //~~(iii)
        
        //Running a for loop over the keys of the dicitonary at (i)
        for (key_ele of key_vals){
               //Delcaring a new variable that has equal values to the one at (ii) ~~(iv)
               key_ele_changed=key_ele
        
        //Running a for loop over every single alphabet of every key      
        for(alphabet in key_ele){

            //Replacing the "_" values in the varaible at (iv), if any
            key_ele_changed=key_ele_changed.replace("_"," ")   
        }

        //Pushing the aforementioned avlues in the form of a dicitonary into component property (^i)
         this.data.assorted_vals.push(`${key_ele_changed}:${value_vals[key_vals.indexOf(key_ele)]}`)
    }

        //Creatng the purchase button and giving it a partially unique id ~~(vi)
        button_purchase=document.createElement("button")
        button_purchase.innerHTML="PURSCHASE"
        button_purchase.setAttribute("id","purchase_btn")

        //Creatng the info button and giving it a partially unique id ~~(vii)
        button_info=document.createElement("button")
        button_info.innerHTML="INFO"
        button_info.setAttribute("id","info_btn")

        //Creatng the rate button and giving it a partially unique id ~~(viii)
        button_rate=document.createElement("button")
        button_rate.innerHTML="RATE"
        button_rate.setAttribute("id","rate_btn")

        //Sourcing the division tag and appending buttons at (vi),(vii),(viii) as children to it
        button_div=document.getElementById("div_btn")
        button_div.appendChild(button_purchase)
        button_div.appendChild(button_info)
        button_div.appendChild(button_rate)

        //Adding an event listener for the purchase button
        button_purchase.addEventListener("click",()=>{

            //Displaying a sweet alert modal to display the corresponding purchase information
            swal({

                //Icon, title, and text attributes
                icon:"./icons/shopping_cart.png",
                title:"PURCHASE",
                text:"Price: \n USD: $10,878,821.28 \n INR:₹ 83,04,00,000 \n [import duties included] ",

                //Buttons attribute
                buttons:{
                    confirm:{
                        text:"Purchase"
                    }
                },

                //Content attribute for the input
                content:{
                    element:"input",
                    attributes:{
                        placeholder:"Enter the quantity", 
                    }
                }   
                })

                //Using the then method upon in which an async function is called for adding the order data
                .then( async (input_value)=>{

                    //Sourcing the automobiles data
                    automobiles=await this.getAutomobiles();

                    //Finding the number of automobiles in stock
                    automobiles_in_stock=automobiles[0]["in_stock"]

                    //Verifying  whether the value inputted by the user is greater than or equal to 1 but lesser than or equal to the number of automobiles in stock

                    ////Case-1 ~The value inputted by the user is greater than or equal to 1 and lesser than or equal to the number of automobiles in stock
                    if(parseInt(input_value)>=1 && parseInt(input_value)<=parseInt(automobiles_in_stock)){

                        //Adding a new odcument to the collection "orders" ~~(ix)
                        firebase.firestore().collection("orders").add({
                            "email":this.data.user_email,
                            "quantity":parseInt(input_value),
                            "time":firebase.firestore.FieldValue.serverTimestamp(),
                            "car":"Pagani Huayra BC"  
                        })
                        
                        //Using the then method in which a function is called for afforming the user of success
                        .then(()=>{
                            swal({
                                "icon":"success",
                                "text":`Purchase Successful! ${parseInt(automobiles[0]["price_calc"]*parseInt(input_value))} has been transferred `,
                                "buttons":false,
                                "timer":1500
                            })

                            //Decrementing the number of automobiles in stock, with accordnace to the user-inputted amount
                            firebase.firestore().collection("automobiles").doc(automobiles[0]["doc_id"]).update({
                                "in_stock":firebase.firestore.FieldValue.increment(-input_value)
                            })
                        })
                    }

                    ////Case-2 ~Else case
                    else {

                        //Calling the function to indicate error
                        this.errorPrompt("Please keep in mind the amount remaining in stock!")
                    }
                })
            })
        
        //Adding an event listener for the info button    
        button_info.addEventListener("click",()=>{

                //Displaying a sweet alert modal to display the corresponding info information
                swal({

                    //Icon, title, and text attributes
                    icon:"./icons/pagani_logo.png",
                    title:"Huayra BC ",
                    text:this.data.assorted_vals.sort().reverse().join("\n")   
                })
            })
        
        //Adding an event listener for the rate button
        button_rate.addEventListener("click",()=>{

            //Displaying a sweet alert modal to display the corresponding rate information
            swal({

                //Icon, title, and text attributes
                icon:"info",
                title:"Rating",
                text:"Will be available by version 0.5.0 \n (current:0.2.1 )"
            })
        })    
    },

    //Defining a function to avail all automobile lists from the database
    getAutomobiles: async function(){

        //Collecting data from firestore
        return await firebase.firestore().
        collection("automobiles").get().
        then(snapshot=>{ return snapshot.docs.map(doc=> doc.data())})
    },

    //Defining an async function to avail all user lists from the database
    getUsers: async function(){

        //Collecitng data from firestore
        return await firebase.firestore().
        collection("users").get().
        then(snapshot=>{ return snapshot.docs.map(doc=> doc.data())})
    },

    //Defining an async function to initiate login and sign-up procedures
    initiateLoginAndSignUpPrompt:  async  function(){
        swal({

            //Text attribute
            text:"Welcome to AutoDown \n The World's Premier Online Car Showcase \n Kindly login, if you already possess an account. If not, a brand new account is just a few clicks away!",

            //Attributes to ensure the alert box does not close on clicking on escape or clicking outside it
            closeOnEsc:false,
            closeOnClickOutside:false,

            //Buttons attribute
            buttons:{
                log_in:{
                    text:"Login",
                    value:"login"
                },
                sign_in:{
                    text:"Sign Up",
                    value:"sign-up"
                }
            }
            })

            //Using the then method in which a function is called to assess the user's choice
            .then((action)=>{

                //Assessing the user's choice, and accoridngly performing required actions

                ////Case-1 -The user wants to login
                if(action==="login"){

                    //Displaying a sweet alert modal to display the first step of login
                    swal({

                        //Title and text attributes
                        title:"Step 1",
                        text:"Please enter your email id",

                        //Attributes to ensure the alert box does not close on clicking on escape or clicking outside it
                        closeOnClickOutside:false,
                        closeOnEsc:false,

                        //Content attribute for the input
                        content:{
                            element:"input",
                            attributes:{
                                placeholder:"Please enter your email id",
                            }   
                        },  
                    })

                    //Using the then method in which a function is called to proceed to the final stage of login
                    .then((input_value_email)=>{

                        //Calling a custom defined function to assess the validity of given parameters, here the email inputted

                        /*
                        Ternary operator used
                        The email is valid->True 
                        The email is invalid->False
                        */

                        this.assessParameters(input_value_email,1)===true?

                        //Displaying a sweet alert modal to display the final step of login
                        swal({

                            //Title and text attributes
                            title:"Step 2",
                            text:"Please enter your password",

                            //Attributes to ensure the alert box does not close on clicking on escape or clicking outside it
                            closeOnClickOutside:false,
                            closeOnEsc:false,

                            //Content attribute for the input
                            content:{
                                element:"input",
                                attributes:{
                                    placeholder:"Password",
                                    value:"",
                                    type:"password"
                                }
                            },   
                        })
                        

                        //Using the async then method in which a function is called to assess all the credentials inputted with reference to information from the database
                        .then( async (input_value_pass)=>{

                            //Calling a custom defined function to assess the validity of given parameters, here the password inputted

                            /*
                            Ternary operator used
                            The password is invalid->True 
                            The password is valid->False
                            */

                            this.assessParameters(input_value_pass,0)!==true?

                            //Calling custom defined function that displays a modifiable error message
                            this.errorPromptAndReturnToHome("At least enter something rather than nothing!")
                            :
                            
                           //Sourcing the password value from the database, using the email stipulated
                           await firebase.firestore().collection("users").where("email","==",input_value_email).get().then(snapshot=>{

                                //Verifying if there are valid results for the email

                                ////Case-1 -The reponse is empty
                                if(snapshot.empty){

                                    //Calling custom defined function that displays a modifiable error message
                                    this.errorPromptAndReturnToHome("The email does not exist")
                                }
                                snapshot.forEach(doc => 
                               this.data.filtered_document.push(doc.data())
                                         )
                                            })

                                //Verifying whether the sourced password matches the inputted one   
                                
                                ////Case-1 -The sourced password matches the inputted one 
                                if(this.data.filtered_document[0]["password"]===input_value_pass){

                                    //Displaying a sweet alert modal with the user's username to affirm success
                                    swal({

                                        //Icon and text attributes
                                        icon:"success",
                                        text:`Welcome ${this.data.filtered_document[0]["user_name"]}`
                                    })

                                    //Sourcing the marker element and setting a custom component to it
                                    marker_el=document.querySelector("#pagani_mrkr")
                                    marker_el.setAttribute("handle-marker")

                                    //Assigning the verified email to a component attribute
                                    this.data.user_email=this.data.filtered_document[0]["email"]

                                    //Sourcing the scene element and setting the arjs component to it
                                    scene_el=document.querySelector("#scene_wrld")
                                    scene_el.setAttribute("arjs",{sourceType:"webcam",debugUIEnabled:"false",sourceWidth:1280,sourceHeight:1800,displayWidth:1280,displayHeight:1800})
                                }

                                ////Case-2 ~Else case
                                else{
                                    this.errorPromptAndReturnToHome("The password is incorrect")
                                }           
                        })
                        :

                        //Calling custom defined function that displays a modifiable error message
                        this.errorPromptAndReturnToHome("Either your email is blank or it does not contain the suffix '@gmail.com'")    
                    })
                }


                ////Case-1 -The user wants to sign up
                else if(action==="sign-up"){

                    //Displaying a sweet alert modal to display the first step of sign up
                    swal({

                        //Title and text attributes
                        title:"Step 1",
                        text:"By joining AutoDown, you are opening the doors to the ultimate supercar experience. View some of the most exquisite cars on the lot using VR! \n We wholeheartedly welcome you, and we hope you enjoy a seamless experience \n \n What would you like to be called?",

                        //Attributes to ensure the alert box does not close on clicking on escape or clicking outside it
                        closeOnClickOutside:false,
                        closeOnEsc:false,

                        //Content attributefor the input
                        content:{
                            element:"input",
                            attributes:{
                                placeholder:"Username (Eg. Pruis_lover_2282.-> Disgusting, but fine)",
                            }
                        },  
                    })

                    //Using a then method in which a function is called to proceed with the second step of sign up
                    .then((input_value)=>{

                        //Pushing the inputted username into a attribute list
                        this.data.user_data_vals.push(input_value)

                        //Calling a custom defined function to assess the validity of given parameters, here the username inputted

                        /*
                        Ternary operator used
                        The password is invalid->True 
                        The password is valid->False
                        */

                        this.assessParameters(input_value,0)===true?

                        //Displaying a sweet alert modal to display the second step of sign up
                        swal({

                            //Title and text attributes
                            title:"Step 2",
                            text:"What would you email id be?",

                            //Attributes to ensure the alert box does not close on clicking on escape or clicking outside it
                            closeOnClickOutside:false,
                            closeOnEsc:false,

                            //Content attribute for the input
                            content:{
                                element:"input",
                                attributes:{
                                placeholder:"Email Id (Eg. Prius_addict@gmail.com -> Wha-Fine...)",
                            }
                        },     
                        })
                        
                        //Using a then method in which a function is called to proceed with the third step of sign up
                        .then((input_value)=>{

                            //Pushing the inputted email into a attribute list
                            this.data.user_data_vals.push(input_value)

                            //Calling a custom defined function to assess the validity of given parameters, here the email inputted

                            /*
                            Ternary operator used
                            The password is invalid->True 
                            The password is valid->False
                            */

                            this.assessParameters(input_value,1)===true?

                            //Displaying a sweet alert modal to display the third step of sign up
                            swal({

                                //Title and text attributes
                                title:"Step 3",
                                text:"What would be the cryptic code to your account?",

                                //Attributes to ensure the alert box does not close on clicking on escape or clicking outside it
                                closeOnClickOutside:false,
                                closeOnEsc:false,

                                //Content attribute for the input
                                content:{
                                    element:"input",
                                    attributes:{
                                    placeholder:"Password (Eg. Prius for lyf -> This is unbearable)",
                                    type:"password"
                                }     
                        },     
                        })
                        
                        //Using a then method in which a function is called to proceed with the fourth step of sign up
                        .then((input_value)=>{

                            //Pushing the inputted password into a attribute list
                            this.data.user_data_vals.push(input_value)

                            //Calling a custom defined function to assess the validity of given parameters, here the password inputted

                            /*
                            Ternary operator used
                            The password is invalid->True 
                            The password is valid->False
                            */

                            this.assessParameters(input_value,0)===true?
                
                                //Displaying a sweet alert modal to display the fourth step of sign up
                                swal({

                                    //Title and text attributes
                                    title:"Step 4",
                                    text:"Where do live so we could deliver your *expensive* orders",

                                    //Attributes to ensure the alert box does not close on clicking on escape or clicking outside it
                                    closeOnClickOutside:false,
                                    closeOnEsc:false,

                                    //Content attribute for the input
                                    content:{
                                        element:"input",
                                        attributes:{
                                        placeholder:"Address (Eg. Prius Paradise -> That does not exist, anorak!)",
                                    }
                        },
                            })
                            
                            //Using a then method in which a function is called to add the credntials into a new user document of collection "users"
                            .then((input_value)=>{

                                //Pushing the inputted address into a attribute list
                                this.data.user_data_vals.push(input_value)

                                //Calling a custom defined function to assess the validity of given parameters, here the password inputted

                                /*
                                Ternary operator used
                                The password is invalid->True 
                                The password is valid->False
                                */

                                this.assessParameters(input_value,0)===true?

                                //Adding all the credentials to a new document of the collection "users" 
                                firebase.firestore().collection("users").add({
                                    "user_name":this.data.user_data_vals[0],
                                    "email":this.data.user_data_vals[1],
                                    "password":this.data.user_data_vals[2],
                                    "address":this.data.user_data_vals[3]
                                })
                                
                                //Using a then method in which a function is called to display the success message
                                .then(()=>{
                                    swal({

                                        //Icon, and text attributes
                                        icon:"success",
                                        text:"You are ready to go!",

                                        //Buttons attribute
                                        buttons:{
                                        proceed:{
                                            text:"Proceed"
                                        }
                                    }
                                    })

                                    //Assigning the verified email to a component attribute
                                    this.data.user_email=this.data.filtered_document[0]["email"]
                                  })
                                  :

                                  //Calling custom defined function that displays a modifiable error message
                                  this.errorPromptAndReturnToHome("At least enter something rather than nothing!")      
                            })
                            :

                            //Calling custom defined function that displays a modifiable error message
                            this.errorPromptAndReturnToHome("At least enter something rather than nothing!")
                        })
                        :

                        //Calling custom defined function that displays a modifiable error message
                        this.errorPromptAndReturnToHome("Either your email is blank or it does not contain the suffix '@gmail.com'")
                        })
                        :

                        //Calling custom defined function that displays a modifiable error message
                        this.errorPromptAndReturnToHome("At least enter something rather than nothing!")
                    })
                }
            })

            //Sourcing the division tag housing the buttons and temporarily removing it
            div=document.getElementById("div_btn")
            div.style.display="none"
        },

        //Defining a function to assess the parameters, and return their boolean validity
        assessParameters:function(val,type){

            //Verifying whether the length of the parameter is greater than 0 or not
            ////Case-1 -The length of the parameter is greater than 0
            if(val.length>0){

                //Verifying whether the type of the parameter is 1 or 0
                ////Case-1 -The type of the parameter is 1
                if(type===1){

                    //Verifying whether the parameter has the gmail.com suffix and is has a length greater than 10
                    ////Case-1 -The parameter has the gmail.com suffix and is has a length greater than 10
                    if(val.includes("@gmail.com") && val.length>10){

                        //Returning a true value
                        return true
                    }


                    ////Case-2 -Else case
                    else{

                        //Returning a false value
                        return false
                    }
                }

                ////Case-2 --The type of the parameter is 0
                else if(type===0){

                    //Returning a true value
                    return true
                }
            }

            ////Case-2 -The length of the parameter is lesser than 0
            else{

                //Returning a false value
                return false
            }
        },

        //Defining a function to display the customized error prompt and to return to the inital sweet alert modal
        errorPromptAndReturnToHome:function(error){

            //Displaying a sweet alert modal to notify the user about failure
            swal({

                //Icon and text attributes
                icon:"error",
                text:error
            })
            
            //Using a then method in which a function is called to recall the login and sign up procedures function
            .then(()=>{

                //Recalling the login and sign up procedures function
                this.initiateLoginAndSignUpPrompt()

                //Setting the array responsible for holding user credentials to empty
                this.data.user_data_vals=[]
            })
        },

        //Defining a function to display the customized error prompt 
        errorPrompt:function(error){

            //Displaying a sweet alert modal to notify the user about failure
            swal({

                //Icon and text attributes
                icon:"error",
                text:error
            })
        }, 
})

//--------------------------------------------------------------------buttons.js-----------------------------------------------------------------//
//----------------------------------------------------------------Automobiles Galore----------------------------------------------------------------//
//----------------------------------------------------------------------C-168----------------------------------------------------------------//