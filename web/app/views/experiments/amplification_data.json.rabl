object false

node(:total_cycles) {(@first_stage_collect_data)? @first_stage_collect_data.num_cycles : 0}

node :amplification_data do
  @amplification_data
end
 
node :ct do
  @ct
end









