class AddIndexLikesToPosts < ActiveRecord::Migration
  def self.up
    change_table(:posts) do |t|
      t.integer  "likes",  default: [], array: true
    end

    add_index :posts, :user_id
  end
  
  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
