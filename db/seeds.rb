# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create(name: 'root', email: 'root@here.com', password: 'superuser', password_confirmation: 'superuser')


User.create(name: 'Bender', email: 'bender@gmail.com', password: 'topsecret', password_confirmation: 'topsecret', friends: [3,4])
User.create(name: 'Leela', email: 'leela@gmail.com', password: 'topsecret', password_confirmation: 'topsecret', friends: [2,4])
User.create(name: 'Fry', email: 'fry@hotmail.es', password: 'topsecret', password_confirmation: 'topsecret', friends: [2,3])


Post.create(user_id: 2, title: "Sexy mama", text: "Hey sexy mama, wanna kill all humans?")
Post.create(user_id: 2, title: "Black jack, and hookers", text: "I'll build by own theme park. With black jack, and hookers. In fact, forget the park!")
Post.create(user_id: 2, title: "Bite It", text: "Bite my shiny metal ass!", photos: ["bender@gmail.com/BenderAvatar_smhf7s","bender@gmail.com/futurama_characters_kjaz7k"])

Post.create(user_id: 3, title: "Mutant language", text: "No, this isn't mutant language. We use a lot more profanity")
Post.create(user_id: 3, title: "So cute", text: "Aww, he's so cute. Wait, no he isn't! It looks like Bender!")
Post.create(user_id: 3, title: "Mrs. Queequeg", text: "Is there Mrs. Queequeg?", photos: ["leela@gmail.com/futurama_ship_mnjtvv","leela@gmail.com/mindless_worker_elzzrr"])

Post.create(user_id: 4, title: "It's the future!", text: "My God!! It's the future! My parents, my co-workers, my girlfriend. I'll never see any of them again. YAHOOO!!!!")
Post.create(user_id: 4, title: "Internet", text: "Wow, you got that off the internet! In my day the internet was only used to download pornography")
Post.create(user_id: 4, title: "Smells like blue", text: "Hey, what smells like blue?", photos: ["fry@hotmail.es/Fry_100_coffee_xoljc7","fry@hotmail.es/tabs_jxmsvx"])
  
#20.times { |i| Post.create(user_id: 2, title: "Post #{i + 1}", created_at: (25 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }