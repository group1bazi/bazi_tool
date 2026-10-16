import csv, sys, json
import numpy as np
sys.argv=["x", sys.argv[1]]
exec(open(__file__.replace("model_v0.py","check_samples.py"), encoding="utf-8").read().split("res = {}")[0])
COLS=['year','month','day','hour']
def feats(r, variant):
    dm=r['day_master']; F={g:np.zeros(8) for g in GODS}
    for c in COLS:
        s=r[c][0]
        if c!='day': F[tengod(dm,s)][0 if c!='month' else 1]+=1
        h=r['hidden_'+c]
        main = h[1] if len(h)==3 else h[0]
        others=[x for i,x in enumerate(h) if not ((len(h)==3 and i==1) or (len(h)<3 and i==0))]
        F[tengod(dm,main)][2 if c!='month' else 3]+=1
        for o in others: F[tengod(dm,o)][4 if c!='month' else 5]+=1
        if c=='day': F[tengod(dm,main)][6]+=1
    return F
X=[];Y=[];G=[];S=[]
for r in rows:
    F=feats(r,0)
    for g in GODS:
        X.append(np.r_[F[g],1.0]); Y.append(float(r['natal_'+g])); G.append(g); S.append(r['sample_id'])
X=np.array(X);Y=np.array(Y);S=np.array(S)
def fit(Xtr,Ytr): return np.linalg.lstsq(Xtr,Ytr,rcond=None)[0]
pred=np.zeros_like(Y)
for sid in sorted(set(S)):
    tr=S!=sid; w=fit(X[tr],Y[tr]); pred[~tr]=np.clip(X[~tr]@w,0,100)
w_all=fit(X,Y)
err=np.abs(pred-Y)
def rank_corr(a,b):
    ra=np.argsort(np.argsort(a)); rb=np.argsort(np.argsort(b)); return np.corrcoef(ra,rb)[0,1]
rc=[rank_corr(pred[S==s],Y[S==s]) for s in sorted(set(S))]
top=[GODS[int(np.argmax(pred[S==s]))]==GODS[int(np.argmax(Y[S==s]))] for s in sorted(set(S))]
zero_ok=np.mean((Y==0)==(pred<5))
base_mae=np.mean(np.abs(Y-Y.mean()))
out=dict(n_values=int(len(Y)), mae=round(float(err.mean()),1), baseline_mae=round(float(base_mae),1), within10=round(float(np.mean(err<=10))*100,1), exact=int(np.sum(np.round(pred)==Y)),
 mean_rank_corr=round(float(np.mean(rc)),2), top_profile_hit=int(sum(top)), zero_pct=round(float(np.mean(Y==0))*100,1),
 zero_classified=round(float(zero_ok)*100,1),
 weights=dict(zip(['stem(yr/hr)','stem(month)','hidden main(yr/day/hr)','hidden main(month)','hidden other(yr/day/hr)','hidden other(month)','day-branch main extra','intercept'],[round(float(x),1) for x in w_all])))
# zero analysis: is a profile 0 exactly when the god is absent from all stems+hidden?
pres=X[:,:7].sum(1)>0
out['zero_iff_absent']=f"{int(np.sum((Y==0)&~pres))} of {int(np.sum(Y==0))} zeros are gods absent from the chart; {int(np.sum((Y>0)&~pres))} absent gods still score >0"
print(json.dumps(out,ensure_ascii=False,indent=1))

pred2=np.where(pres,pred,0.0); err2=np.abs(pred2-Y)
rc2=[rank_corr(pred2[S==s],Y[S==s]) for s in sorted(set(S))]
top2=sum(GODS[int(np.argmax(pred2[S==s]))]==GODS[int(np.argmax(Y[S==s]))] for s in sorted(set(S)))
out2=dict(mae=round(float(err2.mean()),1), within10=round(float(np.mean(err2<=10))*100,1), exact=int(np.sum(np.round(pred2)==Y)), mean_rank_corr=round(float(np.mean(rc2)),2), top_profile_hit=int(top2))
print('with absent->0 rule', out2); out['with_absent_zero_rule']=out2

