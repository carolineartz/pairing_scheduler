# == Schema Information
#
# Table name: pairings
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  member1_id :bigint           not null
#  member2_id :bigint           not null
#  sprint_id  :bigint           not null
#
# Indexes
#
#  index_pairings_on_sprint_id  (sprint_id)
#
# Foreign Keys
#
#  fk_rails_...  (sprint_id => sprints.id)
#

require 'rails_helper'

RSpec.describe Pairing, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
