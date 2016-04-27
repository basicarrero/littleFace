class CreateNotifs < ActiveRecord::Migration
  def change
    create_table :notifs do |t|
      t.integer  :user_id,    null: false
      t.integer  :from,       null: false
      t.string   :nType,      null: false
      t.string   :nTypeAux
      t.string   :message
      t.string   :link
      t.timestamps null: false
    end
    
    add_index :notifs, :user_id
    
  end
end
