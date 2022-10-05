
const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('mongoose');

const token = '5679047467:AAE66rPxFeLWTQYHHdFSzxJ4wTH7mYuwKFg';


const Users = require('./models/users');

const { Telegraf } = require('telegraf');

const bot = new Telegraf(token);


bot.command('start', async ctx => {
    let text = "Я бачу ти тут не вперше)"
    let ifUser = await Users.findOne({userId:ctx.from.id});

    if(ifUser==null){
        let user = new Users({userId:ctx.from.id,name:ctx.from.first_name,tagName:ctx.from.username})
       await user.save();
       text = "Я бачу ти тут вперше)"
    }
 
   await bot.telegram.sendMessage(ctx.chat.id, `Привіт, я бот для знайомств в ВТЕІ ДТЕУ. ${text}` , {
    })
    let user = await Users.findOne({userId:ctx.from.id});
    if(user.aboutMe==undefined){
     return addAboutMe(ctx,bot);
    }
    if(user.photo==undefined){
       addPhoto(ctx,bot);
    }
    if(user.aboutMe!=undefined&&user.photo!=undefined){
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Тепер можна і з кимось познайомитись) /findpeople`);
    }

})

function addAboutMe(ctx,bot){
    ctx.reply("Додай трохи інформації про себе");
    bot.on("text", async (ctx) => {
        let User = await Users.findOne({userId:ctx.from.id});
        User.aboutMe = ctx.message.text
        await User.save();
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Інформація про тебе додана`);
        if(User.photo==undefined){
            return addPhoto(ctx,bot);
        }

   });
}
function addPhoto(ctx,bot){
    ctx.reply("Тепер додай своє фото");
    bot.on("message", async (ctx) => {
        let User = await Users.findOne({userId:ctx.from.id});
        User.photo = ctx.message.photo[2].file_id;
       await User.save();
        console.log(ctx.message.photo[2].file_id)

        await ctx.telegram.sendMessage(ctx.message.chat.id, `Фото додано`);
        await ctx.telegram.sendMessage(ctx.message.chat.id, `Тепер можна і з кимось познайомитись) /findpeople`);
        return
   });
}


bot.command('findpeople', async ctx => {

     await Users.count().exec(async function (err, count) {
        var random = Math.floor(Math.random() * count)
        await Users.findOne().skip(random).exec(
         async function (err, result) {

                await ctx.replyWithPhoto(result.photo,{
                    caption:result.aboutMe,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                    text: "Контакти",
                                    callback_data: `getcontact_${result.userId}`
                                },
                                {
                                    text: "Наступний",
                                    callback_data: 'next'
                                }
                            ],

                        ]
                    }

                    })
          })
      })

})


bot.action(/getcontact_(.+)/, async ctx => {
    let user = await Users.findOne({userId:ctx.match[1]});
    await ctx.telegram.sendMessage(ctx.chat.id,  `@${user.tagName}  ${user.name}`);

})


bot.action('next',async ctx => {

    await Users.count().exec(async function (err, count) {
        var random = Math.floor(Math.random() * count)
        await Users.findOne().skip(random).exec(
         async function (err, result) {

                await ctx.replyWithPhoto(result.photo,{
                    caption:result.aboutMe,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                    text: "Контакти",
                                    callback_data: `getcontact_${result.userId}`
                                },
                                {
                                    text: "Наступний",
                                    callback_data: 'next'
                                }
                            ],

                        ]
                    },
                    data:"aaa"
                    })
          })
      })


});






let start = async () =>{
    app.listen(process.env.PORT || 5000, async () => {
        console.log('🚀 app running on port', process.env.PORT || 5000)
    })
    await mongoose.connect('mongodb+srv://bot:1111@cluster0.xp3ldf6.mongodb.net/?retryWrites=true&w=majority');
    console.log("DB connected!");
    bot.launch();
    console.log("Bot start work!");
}
start();













