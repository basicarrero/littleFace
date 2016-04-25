module PostResourceResolver
  def post_resolver (p)
    if p
      p_attr = p.attributes
        if p.photos.length > 0
          resources = Cloudinary::Api.resources_by_ids(p.photos)['resources']
          p_attr['resources'] = []
          resources.each do |r|
            p_attr['resources'].push({url: r['url'], public_id: r['public_id']})
          end
        end
      return p_attr
    end
  end
  
  def postArray_resolver (postLst)
    result = []
    if postLst
      postLst.each do |p|
        result.push(post_resolver(p))
      end
    end
    return result
  end
end
