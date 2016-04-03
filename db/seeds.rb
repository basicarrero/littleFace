# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

40.times { |i| Post.create(title: "Post #{i + 1}", created_at: (50 - i + 1).days.ago, text: BetterLorem.p(5, false, false)) }