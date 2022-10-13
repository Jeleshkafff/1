// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17 ;

contract bank {

    struct people{
        string name;
        uint balance;
        bool admin;
        bytes32 password;
    }

      struct shablon{
          string name;
          uint sum;
      }

    struct aplication {
        address owner;
        address recipient;
        bytes32 cod_word;
        uint sum;
        bool status;
        bool statusOwner;
        bool statusRecipient;
        bool savety;
        uint answer; // 1-ждем, 0- принял, 3 отказ 4 нет безопасности 
	    uint trys;
        uint id_category;
    }
    struct voice{
        address candidate;
        address[] voting;
        // mapping(address => bool)voting;
        // uint colvo_gol;
        bool status;

    }
        struct Sample{
        uint idCat;
        string nameSample;
        uint CountMoney;
    }

    Sample[] samples;

        struct category{
          string nameCate;
        }
    category[] Categories;
    // Хранилище людей
    mapping(address => people)users;
    // people[] users;

    // Категории
    // mapping(string => shablon[])categories;

    aplication[] aplications;
    voice[] public voices;

    uint count_admin;
    constructor(){
        address adr_admin_1 = 0xE1684E77a65748f306e6Cb61FDbe45E4E85Cf1A2;
        address adr_admin_2 = 0x048b0e87004f0CbB2381EbaDAF1795f790a95455;
        count_admin = 2;

        address adr_user_1 = 0x9A1d6FB38055EF3d7550d8120955aA7b0BB9Bd78;
        address adr_user_2  = 0xe58D560139E1b4B367C89Da16358D1cEff24b483;
        address adr_user_3  = 0xfAD32704C4456192CC405d3570283d478c59b841;
        address adr_user_4 = 0x632857272e217E5ad68D3ebBF9F368067Ea659ba;

        users[adr_admin_1] = (people("Alexey", 1000,true,keccak256(abi.encodePacked("user1"))));
        users[adr_admin_2] = (people("Roma", 1000,true,keccak256(abi.encodePacked("user2")) ));

        users[adr_user_1] = (people("Jonh", 1000,false, keccak256(abi.encodePacked("user3")) ));
        users[adr_user_2] = (people("Andrev", 1000,false, keccak256(abi.encodePacked("user4")) ));
        users[adr_user_3] = (people("Max", 1000,false, keccak256(abi.encodePacked("user5")) ));
        users[adr_user_4] = (people("Kate", 1000,false,keccak256(abi.encodePacked("user6")) ));
        
        Categories.push(category("Personal transfer"));
        samples.push(Sample(0, "Gift", 1));
        samples.push(Sample(0, "Gift", 3));
        samples.push(Sample(0, "Gift", 5));

        Categories.push(category("Payment of rent"));
        samples.push(Sample(1, "Rent", 7));
        samples.push(Sample(1, "Rent", 9));

        Categories.push(category("Personal settlements"));
        samples.push(Sample(2, "Debt repayment", 0));

    }

    function reg(address new_add, bytes32 new_pass, string memory new_name)public returns(bool){
        require(users[new_add].password == 0x0000000000000000000000000000000000000000000000000000000000000000, "you registated");
        users[new_add] = (people(new_name, 1000,false,new_pass ));
        return true;
    }

    function reg_test(address new_add)public view returns(bool){
        require(users[new_add].password == 0x0000000000000000000000000000000000000000000000000000000000000000, "you registated");
        // require(users[new_add].password != 0, "you not registated");
        return true;
    }


    function sing_in(address your_add, bytes32 your_pass)public view returns(bool){
        require(users[your_add].password != 0x0000000000000000000000000000000000000000000000000000000000000000, "you not registated");
        // require(your_add == msg.sender, "you its not you");
        require(users[your_add].password == your_pass, "ne tot pass");
        return true;
    }


    // Оформление перевода
    function translation_formation (address login, uint sum, bytes32 cod_word, uint id_cat, bool savety) public payable{

        // require(users[msg.sender].balance > 0);
if (savety == true){
        aplications.push(aplication(msg.sender, login, cod_word,sum, false,false,false,savety,1, 0, id_cat));

}else{
    aplications.push(aplication(msg.sender, login, cod_word,sum, false,false,false,savety,4, 0, id_cat));
}
        // require(users[msg.sender].balance >= sum);
        // require(msg.value == sum, "111111111111111111111111");
        require(msg.sender != login,"You cant transfer money to self");
        //users[msg.sender].balance = users[msg.sender].balance - sum;
    }

    // Принятие перевода

    function acceptance_of_translation(uint id_aplication, bytes32 cod_word) public{
        require(id_aplication <= aplications.length, "Not found aplication");
        require(aplications[id_aplication].recipient == msg.sender , "You are not recipient");
        require(msg.sender != aplications[id_aplication].owner,"idk");
        require(aplications[id_aplication].status != true, "aplication is nor working");
        require(aplications[id_aplication].trys <= 2, "trys are run out");

        if(cod_word != aplications[id_aplication].cod_word){
            require(aplications[id_aplication].trys != 2, "trys are run out");
            users[aplications[id_aplication].owner].balance = users[aplications[id_aplication].owner].balance + aplications[id_aplication].sum;
            aplications[id_aplication].trys += 1;

            if(aplications[id_aplication].trys == 2){
                payable(aplications[id_aplication].owner).transfer(aplications[id_aplication].sum);
            }
            return;
        }

        users[msg.sender].balance = users[msg.sender].balance + aplications[id_aplication].sum;
        payable(msg.sender).transfer(aplications[id_aplication].sum);//

        aplications[id_aplication].status = true;
    }

    // Отмена перевода со стороны отправителя

    function canceling_owner_transfer (uint id_aplication) public payable{
        require(msg.sender == aplications[id_aplication].owner, "You are not owner");
        require(aplications[id_aplication].status != true,"aplication close");



        users[msg.sender].balance = users[msg.sender].balance + aplications[id_aplication].sum;


        payable(msg.sender).transfer(aplications[id_aplication].sum);//
        aplications[id_aplication].status = true;
        aplications[id_aplication].statusOwner = true;
    }

    // Отмена перевода со стороны получателя
    function canceling_recipient_transfer (uint id_aplication) public payable{
        require(msg.sender == aplications[id_aplication].recipient, "You are not recipient");
        require(aplications[id_aplication].status != true,"aplication close");


        address owner = aplications[id_aplication].owner;
        users[owner].balance = users[owner].balance + aplications[id_aplication].sum;


        payable(owner).transfer(aplications[id_aplication].sum);//
        aplications[id_aplication].status = true;
        aplications[id_aplication].statusRecipient = true;
    }

    function view_aplications() public view returns(aplication[] memory){
        return aplications;
    }

    function view_people(address _address) public view returns(people memory){
        return users[_address];
    }
    // struct voice{
    //     uint id_voice;
    //     address candidate;
    //     mapping(address => bool)voting;
    //     uint colvo_gol;
    //     bool status;

    // }
    // struct voice{
    //     address candidate;
    //      address[] voting;
        // //mapping(address => bool)voting;
    //     bool status;

    // }

        function createVoid(address candidate)public{
        require (users[msg.sender].admin == true,"You not admin");
        voice storage newVoting = voices.push();

        newVoting.candidate = candidate;
        newVoting.voting.push(msg.sender);
        newVoting.status = false;
       
    }

    function give_voice(uint id_voices, bool status_answer)public{
        require(id_voices < voices.length,"cvxcv");
        require(voices[id_voices].status == false,"zxc");
        require (users[msg.sender].admin == true,"You not admin");
        for(uint i=0; i<voices[id_voices].voting.length;i++){
            if(msg.sender == voices[id_voices].voting[i]){
            }
        }
        if(status_answer== true){
           voices[id_voices].voting.push(msg.sender);

           if(voices[id_voices].voting.length == count_admin){
               add_admin(voices[id_voices].candidate);
               voices[id_voices].status=true;
           }
           return;

        }
        voices[id_voices].status=true;
        

    } 
    function add_admin(address user) private{
        users[user].admin = true;
    }

    // function view_all_people() public view returns(people[] memory){
    //     return users;
    // }
    function giveNum() public view returns(bytes32) {
        return users[0x65BF12860e6E8450E5B126e370E245e9340d033c].password;
    }

    function create_categor(string memory name_category)public{
                // require (users[msg.sender].admin == true,"You not admin");
        Categories.push(category(name_category));
    }

    function create_sample(uint categor, string memory name_sample,uint count_mony)public{
                // require (users[msg.sender].admin == true,"You not admin");
                // require(categor == Categories.length );
        samples.push(Sample(categor, name_sample,count_mony));
    }

    function view_categories()public view returns(category[] memory){
        return Categories;

    }
    
     function view_samples()public view returns(Sample[] memory){
        return samples;

    }

    function saveAd(uint zero_or_tree, uint id) public{
        require(zero_or_tree==0 || zero_or_tree==3,"ne to chislo");
        require (users[msg.sender].admin == true,"You not admin");
        require(aplications[id].savety==true,"he is not save");
        require(aplications[id].status != true,"zacrito");
        aplications[id].answer = zero_or_tree;
        aplications[id].status = true;
    }

}